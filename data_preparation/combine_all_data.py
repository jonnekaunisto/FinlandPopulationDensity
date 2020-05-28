import pandas as pd
import json

data_file = "../raw_data_all_regions/population_finland.csv"
geo_file = "../topo_without_data.json"
area_file = "../raw_data_all_regions/area_finland.csv"

kunta_trans = {
    "Middle Karelia": "Keski-Karjala",
    "Pielisen Karelia": "Pielisen Karjala",
    "North Eastern Savonia": "Koillis-Savo",
    "Upper Savonia": "Ylä-Savo",
    "Eastern Lapland": "Itä-Lappi",
    "Kemi-Tornio": "Kemi-Tornio",
    "Northern Lapland": "Pohjois-Lappi",
    "Tornio Valley": "Torniolaakso",
    "Tunturi Lapland": "Tunturi-Lappi",
    "Kehys-Kainuu": "Kehys-Kainuu",
    "Koillismaa": "Koillismaa",
    "Nivala-Haapajärvi": "Nivala-Haapajärvi",
    "Oulunkaari": "Oulunkaari",
    "Kotka-Hamina": "Kotka-Hamina",
    "Western Saimaa": "Pohjois-Savo",
    "Ekenäs": "Raasepori",
    "South Eastern Middle": "Pirkanmaa",
    "Åboland-Turunmaa": "Åboland-Turunmaa",
    "Vakka-Suomi": "Vakka-Suomi",
    "Jakobstadsregionen": "Jakobstadsregionen",
    "Kyrönmaa": "Kyrönmaa",
    "South Eastern Bothnia": "South Eastern Bothnia",
    "North Western Pirkanm": "Pirkanmaa",
    "South Eastern Pirkanm": "Pirkanmaa",
    "South Western Pirkanm": "Lounais-Pirkanmaa",
    "Southern Pirkanmaa": "Etelä-Pirkanmaa",
    "Upper Pirkanmaa": "Ylä-Pirkanmaa",
    "Northern Satakunta": "Pohjois-Satakunta",
    "South Eastern Satakun": "Satakunta",
    "Härmänmaa": "Kauhava",
    "Järviseutu": "Järviseutu",
    "Kuusiokunnat": "Kuusiokunnat",
    "Northern Seinänaapuri": "Seinäjoki",
    "South Eastern Bothnia": "Etelä-Pohjanmaa",
    "Southern Seinänaapuri": "Seinäjoki"
}


land_trans = {
    "Middle Karelia": "Pohjois-Karjala",
    "Pielisen Karelia": "Pohjois-Karjala",
    "North Eastern Savonia": "Pohjois-Savo",
    "Upper Savonia": "Pohjois-Savo",
    "Eastern Lapland": "Lappi",
    "Kemi-Tornio": "Kemi",
    "Northern Lapland": "Lappi",
    "Tornio Valley": "Tornio",
    "Tunturi Lapland": "Lappi",
    "Kehys-Kainuu": "Kainuu",
    "Koillismaa": "Lappi",
    "Nivala-Haapajärvi": "Nivala",
    "Oulunkaari": "Oulu",
    "Kotka-Hamina": "Kotka",
    "Western Saimaa": "Pohjois-Savo",
    "Ekenäs": "Raasepori",
    "South Eastern Middle": "Pirkkala",
    "Åboland-Turunmaa": "Turku",
    "Vakka-Suomi": "Varsinais-Suomi",
    "Jakobstadsregionen": "Janakkala",
    "Kyrönmaa": "Hämeenkyrö",
    "South Eastern Bothnia": "Pirkanmaa",
    "North Western Pirkanm": "Pirkanmaa",
    "South Eastern Pirkanm": "Pirkanmaa",
    "South Western Pirkanm": "Pirkanmaa",
    "Southern Pirkanmaa": "Pirkanmaa",
    "Upper Pirkanmaa": "Pirkanmaa",
    "Northern Satakunta": "Satakunta",
    "South Eastern Satakun": "Satakunta",
    "Härmänmaa": "Päijät-Häme",
    "Järviseutu": "Jämijärvi",
    "Kuusiokunnat": "Kuusamo",
    "Northern Seinänaapuri": "Seinäjoki",
    "South Eastern Bothnia": "Pirkanmaa",
    "Southern Seinänaapuri": "Seinäjoki"
}

def process_land_data():
    land_data = pd.read_csv(area_file)


    land_data_dict = {}
    for row in land_data.itertuples():
        land_data_dict[row[1]] = row[2]

    return land_data_dict


def process_pop_data():
    pop_data = pd.read_csv(data_file)


    pop_data_dict = {}
    for row in pop_data.itertuples():
        if row[1] in ["MANNER - SUOMI", "AHVENANMAA"]:
            continue
        region_data = {}

        start_year = 2019
        for i, elem in enumerate(row[2:]):
            region_data[str(start_year+i)] = elem

        pop_data_dict[row[1]] = region_data

    return pop_data_dict

def add_data_to_topo(name, pop_data_dict, land_data_dict):
    with open(geo_file, "r") as f:
        topo_json = json.loads(f.read())

    target_list = topo_json["objects"]["gadm36_FIN_" + name]["geometries"]

    #make sure all of them match
    print("===============all that match =================")
    for target in target_list:
        region_name = target["properties"]["NAME_" + name]

        region_name_trans = kunta_trans.get(region_name, region_name)
        region_name_land_trans = land_trans.get(region_name, region_name)

        if region_name_trans in pop_data_dict:
            target["properties"]["pop_data"] = pop_data_dict[region_name_trans]
        else:
            print("\"{0}\": \"{0}\",".format(region_name))

        if region_name_land_trans in land_data_dict:
            target["properties"]["land_data"] = land_data_dict[region_name_land_trans]
        else:
            print("\"{0}\": \"{0}\",".format(region_name))


    with open("topo_with_data.json", "w") as f:
        f.write(json.dumps(topo_json))


def main():

    land_data_dict = process_land_data()
   
    pop_data_dict = process_pop_data()

    add_data_to_topo("3", pop_data_dict, land_data_dict)

    add_data_to_topo("2", pop_data_dict, land_data_dict)

    exit()

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


    



if __name__ == "__main__":
    main()