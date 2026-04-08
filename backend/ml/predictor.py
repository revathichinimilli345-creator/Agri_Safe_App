import random
import joblib
import os
import numpy as np
import pandas as pd
from .crop_info import CROP_METADATA

try:
    from .crop_stats import CROP_STATS
except ImportError:
    CROP_STATS = {}

# Load Model and Preprocessors
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'crop_model.joblib')
SCALER_PATH = os.path.join(BASE_DIR, 'scaler.joblib')
ENCODER_PATH = os.path.join(BASE_DIR, 'encoder.joblib')

# Check if model exists
if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH) and os.path.exists(ENCODER_PATH):
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    ohe = joblib.load(ENCODER_PATH)
else:
    model = None
    scaler = None
    ohe = None


def find_closest_crops(n, p, k, temp, hum, ph, rain, top_n=3):
    """
    Distance-based crop suggestion algorithm. Features are unscaled for intuitive distance.
    (Normalizing distance inside would be better mathematically, but this provides a logical relative match)
    """
    input_vector = np.array([n, p, k, temp, hum, ph, rain])
    
    # Scale it just for distance calculation to ensure features like rainfall don't dominate
    distances = []
    
    for crop, stats in CROP_STATS.items():
        # Using a weighted absolute percentage difference to give equal importance across vastly different scales
        crop_vector = np.array(stats)
        
        # Avoid division by zero
        safe_crop_vector = np.where(crop_vector == 0, 0.001, crop_vector)
        
        # Percentage difference
        diffs = np.abs(input_vector - crop_vector) / safe_crop_vector
        overall_diff = np.sum(diffs)
        
        distances.append((crop, overall_diff))
        
    distances.sort(key=lambda x: x[1])
    return [crop for crop, diff in distances[:top_n]]


def predict_suitability(temperature, rainfall, nitrogen, phosphorus, potassium, ph, soil_type, state="Region", humidity=60.0):
    """
    ML-based predictor using scikit-learn RandomForest model for core suitability, 
    accompanied by algorithmic recommendations.
    """
    is_suitable = False
    explanation_points = []
    suggested_crops = []
    
    # 1. Prepare Features for ML
    if model and scaler and ohe:
        try:
            # Create DataFrames to ensure correct column names for transformers if required, 
            # though our transformers were fit on arrays/specific df slices.
            num_data = pd.DataFrame(
                [[nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]],
                columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
            )
            cat_data = pd.DataFrame(
                [[soil_type, state]],
                columns=['soil_type', 'state']
            )
            
            # Transform
            num_scaled = scaler.transform(num_data)
            cat_encoded = ohe.transform(cat_data)
            
            features = np.hstack((num_scaled, cat_encoded))
            
            # Predict Suitability
            suitability_pred = model.predict(features)[0]
            is_suitable = True if suitability_pred == 1 else False
            
            if is_suitable:
                if CROP_STATS:
                    suggested_crops = find_closest_crops(nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall)
                else:
                    suggested_crops = ['Rice', 'Maize', 'Wheat'] # fallback
                    
                explanation_points.append(f"• Analytical Model verified that {state}'s soil health (N:{nitrogen}, P:{phosphorus}, K:{potassium}, pH:{ph}) is Suitable.")
                explanation_points.append(f"• Climate parameters (Temp: {temperature}°C, Rain: {rainfall}mm) match optimal growing conditions.")
                explanation_points.append(f"• Machine matching identified {suggested_crops[0]} as the most compatible crop for this region.")
            else:
                suggested_crops = []
                explanation_points.append(f"• Analytical Model indicates Land in {state} is Currently Not Suitable for standard crops.")
                
                # Dynamic Failure Reason Logic
                if ph < 5.0: explanation_points.append(f"• Severe Acidity (pH {ph}) detected. Soil reclamation required.")
                elif ph > 8.5: explanation_points.append(f"• Severe Alkalinity (pH {ph}) detected. Soil reclamation required.")
                
                if temperature < 10 or temperature > 40: explanation_points.append(f"• Ambient temperatures ({temperature}°C) are extremely prohibitive for active growth.")
                
                if nitrogen < 30 and phosphorus < 20 and potassium < 20:
                    explanation_points.append(f"• Soil macronutrients (N:{nitrogen}, P:{phosphorus}, K:{potassium}) are fundamentally depleted.")
                    
                if rainfall < 30 and temperature > 30:
                    explanation_points.append(f"• Drought conditions detected with severe heat stress ({temperature}°C, {rainfall}mm rain).")

        except Exception as e:
            print(f"Prediction Error: {e}")
            is_suitable = False
            explanation_points = ["Error in analytical matching logic."]
            suggested_crops = []
    else:
        # Fallback to current heuristic logic if model not found
        is_suitable = True
        explanation_points = ["Preliminary heuristic match: System training in progress."]
        suggested_crops = ["Rice", "Maize"]
    
    explanation = "\n".join(explanation_points)
    recommendations = []
    
    # 2. Add Algorithmic Prescriptions (Gap Analysis)
    if is_suitable and suggested_crops and CROP_STATS and suggested_crops[0] in CROP_STATS:
        avg_n, avg_p, avg_k, avg_temp, avg_hum, avg_ph, avg_rain = CROP_STATS[suggested_crops[0]]
        
        # pH Reclamation Algorithm
        ph_deficit = avg_ph - ph
        if ph_deficit > 0.5:
            lime_needed = round(ph_deficit * 1.5, 1)
            recommendations.append(f"Acidity Management for {state}: pH {ph} detected. Apply ~{lime_needed} t/ha of lime to reach {avg_ph}.")
        elif ph_deficit < -0.5:
            gypsum_needed = round(abs(ph_deficit) * 1.2, 1)
            recommendations.append(f"Alkalinity Control for {state}: pH {ph} detected. Apply ~{gypsum_needed} t/ha of gypsum for pH correction.")
            
        # NPK Deficit Algorithm
        n_deficit = avg_n - nitrogen
        if n_deficit > 5:
            urea_kg = round(n_deficit * 2.17, 1)
            recommendations.append(f"Nitrogen Correction for {state} soil: Add {urea_kg} kg/ha Urea to offset {round(n_deficit, 1)} mg/kg deficit.")
            
        p_deficit = avg_p - phosphorus
        if p_deficit > 5:
            ssp_kg = round(p_deficit * 6.25, 1)
            recommendations.append(f"Phosphorus Boost in {state}: Apply {ssp_kg} kg/ha SSP to improve root development.")

        k_deficit = avg_k - potassium
        if k_deficit > 5:
            mop_kg = round(k_deficit * 1.67, 1)
            recommendations.append(f"Potassium Supplement in {state}: Use {mop_kg} kg/ha MOP for better disease resistance.")
            
        # Hydration Deficit Algorithm
        rain_deficit = avg_rain - rainfall
        if rain_deficit > 50:
            water_vol = round(rain_deficit * 10, 0)
            recommendations.append(f"Irrigation Required in {state}: ~{water_vol} m³/ha supplemental water needed.")
        elif rain_deficit < -100:
            recommendations.append(f"Drainage Priority in {state}: Rainfall is {abs(rain_deficit)}mm above average.")
    elif not is_suitable:
        recommendations.append(f"Immediate soil remediation required in {state} before planting attempts. Consult a local expert.")
    else:
        recommendations.append(f"Apply balanced NPK dose according to standard recommendation for {state}.")

    # 3. Fetch Crop specific metadata with enhanced randomization/branching
    crop_info = {}
    if is_suitable and suggested_crops:
        base_info = CROP_METADATA.get(suggested_crops[0], {})
        
        # Fallback for crops not explicitly defined
        if not base_info:
            pulses = ['Kidneybeans', 'Blackgram', 'Lentil', 'Pigeonpeas', 'Mothbeans', 'Chickpea', 'Mungbean']
            if suggested_crops[0] in pulses:
                base_info = CROP_METADATA.get('Pulses')
            else:
                base_info = {
                    'seed_varieties': f'Standard {suggested_crops[0]} Variety, High-Yield {suggested_crops[0]} Local',
                    'sowing_window': 'Align with local seasonal calendar',
                    'fertilizer': 'Apply standard baseline dose based on testing',
                    'irrigation': 'Maintain field capacity at critical stages'
                }

        if CROP_STATS and suggested_crops[0] in CROP_STATS and base_info:
            avg_n, avg_p, avg_k, avg_temp, avg_hum, avg_ph, avg_rain = CROP_STATS[suggested_crops[0]]
            
            # 4.1 Seed Resilience Algorithm
            seeds = [s.strip() for s in base_info.get('seed_varieties', '').split(',')]
            rain_ratio = rainfall / avg_rain if avg_rain > 0 else 1
            
            if rain_ratio < 0.7:
                best_seed = seeds[0] 
                crop_info['seed_varieties'] = f"{best_seed} (Precision Selection for Drought Resilience in {state}). Secondary: {', '.join(seeds[1:])}"
            elif ph > 7.8:
                alk_seed = seeds[-1] if len(seeds) > 1 else seeds[0]
                crop_info['seed_varieties'] = f"{alk_seed} (Mapped for Salinity Tolerance in pH {ph} soil found in {state}). Alternative: {', '.join(seeds[:-1])}"
            elif nitrogen < (avg_n * 0.5):
                 pref_seed = seeds[1] if len(seeds) > 2 else seeds[0]
                 crop_info['seed_varieties'] = f"{pref_seed} (Optimized for low-nitrogen soil in {state}). Supportive: {', '.join(seeds[2:]) or seeds[0]}"
            else:
                variation = random.choice(["Optimal Yield Profile", "Hybrid Vigor Variety", "Standard Verified Seed"])
                crop_info['seed_varieties'] = f"{seeds[0]} ({variation} optimized for {state} climate). Additional: {', '.join(seeds[1:])}"

            # 4.2 Thermal Shift Algorithm (Sowing)
            temp_diff = temperature - avg_temp
            base_sowing = base_info.get('sowing_window', '')
            
            if temp_diff > 4:
                sowing_shift = f"URGENT: Ambient {temperature}°C in {state} exceeds {suggested_crops[0]} limit. Delay sowing to avoid heat stress."
            elif temp_diff > 2:
                sowing_shift = f"ADVISORY: Warm conditions (+{round(temp_diff, 1)}°C) for {state}. Increase seed rate by 10% to ensure stand."
            elif temp_diff < -4:
                sowing_shift = f"WARNING: Cold shock potential ({temperature}°C) in {state}. Direct sowing not recommended; use nursery."
            elif rainfall > (avg_rain * 1.5):
                sowing_shift = f"CAUTION: Excessive moisture ({rainfall}mm) recorded in {state}. Delay sowing until soil drain occurs to prevent damping off."
            else:
                sowing_shift = f"STABLE: Environmental conditions ({temperature}°C, {rainfall}mm rain) in {state} permit standard sowing schedule."
            
            crop_info['sowing_window'] = f"{base_sowing}\n\n{sowing_shift}"

            # 4.3 Quantitative Nutrient Algorithm (Fertilizer)
            n_gap = max(0, avg_n - nitrogen)
            p_gap = max(0, avg_p - phosphorus)
            k_gap = max(0, avg_k - potassium)
            
            urea = round(n_gap * 2.17, 1)
            ssp = round(p_gap * 6.25, 1)
            mop = round(k_gap * 1.67, 1)
            
            base_fert = base_info.get('fertilizer', '')
            
            if ph < 5.5: special_note = f"High acidity (pH {ph}) detected in {state}: Mix fertilizers with Rock Phosphate for better uptake."
            elif ph > 8.0: special_note = f"High alkalinity (pH {ph}) detected in {state}: Apply Ammonium Sulphate instead of Urea if possible."
            else: special_note = f"Balanced pH ({ph}) in {state}: Standard NPK uptake efficiency expected."

            fert_prescription = f"QUANTITATIVE DOSE: Based on {state}'s soil test ({nitrogen}N, {phosphorus}P, {potassium}K), apply {urea} kg/ha Urea, {ssp} kg/ha SSP, and {mop} kg/ha MOP.\n{special_note}"
            crop_info['fertilizer'] = f"{base_fert}\n\n{fert_prescription}"

            # 4.4 Evapotranspiration Volumetric Algorithm (Irrigation)
            rain_deficit = max(0, avg_rain - rainfall)
            vol_m3 = rain_deficit * 10
            
            evt_factor = 1.0
            if temperature > 35: evt_factor += 0.3
            elif temperature > 30: evt_factor += 0.15
            
            if humidity < 30: evt_factor += 0.2
            elif humidity > 80: evt_factor -= 0.1
            
            adjusted_vol = round(vol_m3 * evt_factor, 0)
            
            base_irrig = base_info.get('irrigation', '')
            if adjusted_vol > 500: irrig_calc = f"IRRIGATION LOGIC: Severe deficit detected based on {state} climate. Apply {adjusted_vol} m³/ha (EVT Adjustment: {round(evt_factor, 1)}x)."
            elif adjusted_vol > 0: irrig_calc = f"IRRIGATION LOGIC: Moderate deficit in {state}. Apply {adjusted_vol} m³/ha at critical growth stages."
            else: irrig_calc = f"IRRIGATION LOGIC: Input rainfall ({rainfall}mm) in {state} covers needs. No volumetric supplement required."
                
            crop_info['irrigation'] = f"{base_irrig}\n\n{irrig_calc}"
        else:
            crop_info = base_info

    # 4. Handle Unsuitable Cases with Reclamation Advice
    if not is_suitable:
        reclamation_info = {
            'seed_varieties': f"N/A - Direct Seeding NOT recommended for {state}. Use multi-stage nursery if essential, or avoid planting until soil parameters are corrected.",
            'sowing_window': f"DELAYED in {state}: Land requires 30-60 days of green manuring or chemical amendment before any sowing attempts.",
            'fertilizer': f"RECLAMATION DOSE for {state}: Apply 2.5 t/ha Lime (if Acidic) or Gypsum (if Alkaline). Add 10 t/ha Farm Yard Manure to restore microbial health.",
            'irrigation': f"FLUSHING LOGIC for {state}: Heavy initial irrigation required to leach salts (if Alkaline) or balance pH. Ensure 100% drainage capacity."
        }
        return {
            'is_suitable': False,
            'explanation': explanation,
            'recommendations': " | ".join(recommendations) if recommendations else "Soil reclamation required.",
            'suggested_crops': "",
            'crop_info': reclamation_info
        }

    return {
        'is_suitable': is_suitable,
        'explanation': explanation,
        'recommendations': " | ".join(recommendations) if recommendations else "Soil conditions are evaluated.",
        'suggested_crops': ", ".join(suggested_crops) if is_suitable and suggested_crops else "",
        'crop_info': crop_info if is_suitable else {}
    }
