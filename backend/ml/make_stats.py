import pandas as pd
import json

df = pd.read_csv('ml_data.csv')
stats = df.groupby('label')[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']].mean().to_dict('index')

with open('crop_stats.py', 'w') as f:
    f.write('CROP_STATS = {\n')
    for k, v in stats.items():
        f.write(f'    "{k.capitalize()}": ({v["N"]}, {v["P"]}, {v["K"]}, {v["temperature"]}, {v["humidity"]}, {v["ph"]}, {v["rainfall"]}),\n')
    f.write('}\n')
