from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, 
    UserMeView,
    PredictionHistoryView, 
    AdminAllHistoryView, 
    AdminUserListView, 
    AdminStatsView,
    LandSuitabilityPredictionView
)

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/me/', UserMeView.as_view(), name='user_me'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User Features
    path('predict/', LandSuitabilityPredictionView.as_view(), name='predict'),
    path('history/', PredictionHistoryView.as_view(), name='history'),
    
    # Admin Features
    path('admin/all-history/', AdminAllHistoryView.as_view(), name='admin_all_history'),
    path('admin/users/', AdminUserListView.as_view(), name='admin_users'),
    path('admin/users/<int:pk>/', AdminUserListView.as_view(), name='admin_user_detail'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),
]
