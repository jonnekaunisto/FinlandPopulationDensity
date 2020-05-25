import pandas as pd
import json

data_file = "../combined.csv"
geo_file = "../topo.json"

pop_data = pd.read_csv(data_file)

print(pop_data)

pop_data_dict = {}
for row in pop_data.itertuples():
    region_data = {}

    start_year = 1990

    for i in range(2,53):
        region_data[str(start_year+(i-2))] = row[i]

    pop_data_dict[row[1]] = region_data
print(pop_data_dict)

regions = pop_data["Maakunta"]

'''
for region in regions:
    print(region)
'''

with open(geo_file, "r") as f:
    topo_json = json.loads(f.read())

print(topo_json.keys())

target_list = topo_json["objects"]["gadm36_FIN_2"]["geometries"]

'''
for region in target_list:
    print(region["properties"]["NAME_2"])
'''


#make sure all of them match
print("===============all that match =================")
for region in regions:
    matched = False
    for target in target_list:
        if target["properties"]["NAME_2"] == region:
            matched = True
            target["pop_data"] = pop_data_dict[region]
            break

    if not matched:
        print(region)


with open("output.json", "w") as f:
    f.write(json.dumps(topo_json))



