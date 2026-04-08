from django.contrib.auth.models import User
from django.db.models import Avg, Count
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import PredictionResult
from .serializers import PredictionResultSerializer, UserSerializer
from ml.predictor import predict_suitability

class UserMeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if User.objects.filter(username=username).exists():
            return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

class PredictionHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        predictions = PredictionResult.objects.filter(user=request.user).order_by('-created_at')
        serializer = PredictionResultSerializer(predictions, many=True)
        return Response(serializer.data)

class AdminAllHistoryView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        user_id = request.query_params.get('user_id')
        if user_id:
            predictions = PredictionResult.objects.filter(user_id=user_id).order_by('-created_at')
        else:
            predictions = PredictionResult.objects.all().order_by('-created_at')
        serializer = PredictionResultSerializer(predictions, many=True)
        return Response(serializer.data)

class AdminUserListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.is_active = request.data.get('is_active', user.is_active)
            user.username = request.data.get('username', user.username)
            user.email = request.data.get('email', user.email)
            user.save()
            return Response(UserSerializer(user).data)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class AdminStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # Basic Counts
        total_users = User.objects.count()
        total_predictions = PredictionResult.objects.count()
        
        # Suitability Distribution (for Pie Chart)
        suitable_count = PredictionResult.objects.filter(is_suitable=True).count()
        not_suitable_count = total_predictions - suitable_count
        
        # Average Soil Health Profile
        soil_health = PredictionResult.objects.aggregate(
            avg_n=Avg('nitrogen'),
            avg_p=Avg('phosphorus'),
            avg_k=Avg('potassium'),
            avg_ph=Avg('ph')
        )
        
        # Top Recommended Crops Ranking
        top_crops = PredictionResult.objects.values('suggested_crops').annotate(
            count=Count('suggested_crops')
        ).order_by('-count')[:5]
        
        # Top Regions Activity
        top_regions = PredictionResult.objects.values('state').annotate(
            count=Count('state')
        ).order_by('-count')[:5]
        
        # Recent Activity (Latest 5)
        recent_predictions = PredictionResult.objects.all().order_by('-created_at')[:5]
        recent_activity = PredictionResultSerializer(recent_predictions, many=True).data

        stats = {
            "total_users": total_users,
            "total_predictions": total_predictions,
            "suitability_dist": [
                {"name": "Suitable", "count": suitable_count, "color": "#2ecc71"},
                {"name": "Not Suitable", "count": not_suitable_count, "color": "#e74c3c"}
            ],
            "soil_health": {
                "n": round(soil_health['avg_n'] or 0, 2),
                "p": round(soil_health['avg_p'] or 0, 2),
                "k": round(soil_health['avg_k'] or 0, 2),
                "ph": round(soil_health['avg_ph'] or 0, 2)
            },
            "top_recommended_crops": list(top_crops),
            "top_regions": list(top_regions),
            "recent_activity": recent_activity
        }
        return Response(stats)

class LandSuitabilityPredictionView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            data = request.data
            
            # Extract features
            temperature = float(data.get('temperature', 25.0))
            rainfall = float(data.get('rainfall', 100.0))
            nitrogen = float(data.get('nitrogen', 50.0))
            phosphorus = float(data.get('phosphorus', 50.0))
            potassium = float(data.get('potassium', 50.0))
            ph = float(data.get('ph', 6.5))
            soil_type = data.get('soil_type', 'Alluvial')
            state = data.get('state', 'Region')
            humidity = float(data.get('humidity', 60.0))

            # Run ML Prediction
            result = predict_suitability(
                temperature=temperature,
                rainfall=rainfall,
                nitrogen=nitrogen,
                phosphorus=phosphorus,
                potassium=potassium,
                ph=ph,
                soil_type=soil_type,
                state=state,
                humidity=humidity
            )

            # Map the result to our model fields
            crop_info = result.get('crop_info', {})
            
            prediction_instance = PredictionResult.objects.create(
                user=request.user if request.user.is_authenticated else None,
                state=state,
                ph=ph,
                nitrogen=nitrogen,
                phosphorus=phosphorus,
                potassium=potassium,
                temperature=temperature,
                humidity=humidity,
                rainfall=rainfall,
                suggested_crops=result.get('suggested_crops', ''),
                is_suitable=result.get('is_suitable', False),
                seed_recommendation=crop_info.get('seed_varieties', ''),
                sowing_window=crop_info.get('sowing_window', ''),
                fertilizer_recommendation=crop_info.get('fertilizer', ''),
                irrigation_schedule=crop_info.get('irrigation', ''),
                explanation=result.get('explanation', ''),
                recommendations=result.get('recommendations', '')
            )

            serializer = PredictionResultSerializer(prediction_instance)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
