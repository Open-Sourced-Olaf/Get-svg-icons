# Builds icon JSON

import json

def main():
    result = {}
    with open('bootstrap-icons.json') as f:
        icons = json.load(f)
        i = 0
        for icon in icons:
            result[icon['name']] = {
                'prefix': icon['name'],
                'body': icon['svg'],
                'description': icon['tags'].split(', ')
            }

        with open('updated-icons.json', 'w') as new:
            json.dump(result, new)
    
    return json.dumps(result)

if __name__ == '__main__':   
    result = main()