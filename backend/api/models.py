from django.db import models
from django.contrib.auth.models import User

class PredictionResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='predictions', null=True, blank=True)
    state = models.CharField(max_length=100)
    ph = models.FloatField()
    suggested_crops = models.TextField()
    is_suitable = models.BooleanField()
    
    # Input Soil/Climate Parameters (for GraphScreen)
    nitrogen = models.FloatField(default=0.0)
    phosphorus = models.FloatField(default=0.0)
    potassium = models.FloatField(default=0.0)
    temperature = models.FloatField(default=0.0)
    humidity = models.FloatField(default=0.0)
    rainfall = models.FloatField(default=0.0)
    
    # Phase 2 & Cultivation Kit Advice
    seed_recommendation = models.TextField(blank=True, null=True)
    sowing_window = models.TextField(blank=True, null=True)
    fertilizer_recommendation = models.TextField(blank=True, null=True)
    irrigation_schedule = models.TextField(blank=True, null=True)
    
    explanation = models.TextField(blank=True, null=True)
    recommendations = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prediction for {self.state} - {self.created_at}"
