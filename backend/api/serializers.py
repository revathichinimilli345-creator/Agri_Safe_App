from django.contrib.auth.models import User
from rest_framework import serializers
from .models import PredictionResult

class UserSerializer(serializers.ModelSerializer):
    prediction_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'is_superuser', 'is_active', 'date_joined', 'prediction_count']

    def get_prediction_count(self, obj):
        return obj.predictions.count()

class PredictionResultSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PredictionResult
        fields = '__all__'

    def to_representation(self, instance):
        """
        Returns a hybrid response structure:
        - Root: Soil parameters (for GraphScreen)
        - 'prediction' key: All cultivation results and advice
        """
        representation = super().to_representation(instance)
        
        # Results to be nested in 'prediction' key
        prediction_fields = [
            'is_suitable', 'explanation', 'recommendations', 
            'seed_recommendation', 'sowing_window', 
            'fertilizer_recommendation', 'irrigation_schedule', 
            'suggested_crops', 'id', 'created_at'
        ]
        
        # Build the 'prediction' object
        prediction_data = {}
        for field in prediction_fields:
            if field in representation:
                prediction_data[field] = representation[field]
        
        # Nest the prediction data
        representation['prediction'] = prediction_data
        
        return representation
