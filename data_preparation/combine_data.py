import pandas as pd
import json

data_file = "../combined.csv"
geo_file = "../topo_without_data.json"
area_file = "../land_area.csv"


land_data = pd.read_csv(area_file)

land_data_dict = {}
for row in land_data.itertuples():
    land_data_dict[row[1]] = row[2]

print(land_data_dict)

pop_data = pd.read_csv(data_file)

print(pop_data)

pop_data_dict = {}
for row in pop_data.itertuples():
    if row[1] in ["MANNER - SUOMI", "AHVENANMAA"]:
        continue
    region_data = {}

    start_year = 1990

    for i in range(2,53):
        region_data[str(start_year+(i-2))] = row[i]/land_data_dict[row[1]]

    pop_data_dict[row[1]] = region_data

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

for region in land_data["Maakunta"]:
    matched = False
    for target in target_list:
        if target["properties"]["NAME_2"] == region:
            matched = True
            break
    if not matched:
        print(region)

for target in target_list:
    matched = False
    for region in regions:
        if target["properties"]["NAME_2"] == region:
            matched = True
    if not matched:
        print(target["properties"]["NAME_2"])


#make sure all of them match
print("===============all that match =================")
for target in target_list:
    matched = False
    for region in regions:
        if target["properties"]["NAME_2"] == region:
            matched = True
            target["properties"]["pop_data"] = pop_data_dict[region]
            break
        elif target["properties"]["NAME_2"] == "Eastern Uusimaa":
            matched = True
            target["properties"]["pop_data"] = pop_data_dict["Uusimaa"]

    if not matched:
        print(region)

with open("topo_with_data.json", "w") as f:
    f.write(json.dumps(topo_json))



