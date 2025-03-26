import os

def list_paths(root_dir):
    collected_paths = []
    for root, dirs, files in os.walk(root_dir):
        # Filter de directories zodat .venv, node_modules en .git niet worden doorlopen
        dirs[:] = [d for d in dirs if d not in (".venv", "node_modules", ".git")]
        
        # Voeg de paden van alle bestanden toe
        for file in files:
            collected_paths.append(os.path.join(root, file))
        
        # Voeg optioneel ook de paden van de directories toe
        for d in dirs:
            collected_paths.append(os.path.join(root, d))
    return collected_paths

if __name__ == '__main__':
    # Definieer de root directory
    root_directory = r"C:\Users\gieln\code\projects\website\gnijkamp"
    
    # Verkrijg alle paden
    paths = list_paths(root_directory)
    
    # Definieer het uitvoerbestand in dezelfde directory
    output_file = os.path.join(root_directory, "paths.txt")
    
    # Schrijf de paden naar het uitvoerbestand
    with open(output_file, "w", encoding="utf-8") as f:
        for path in paths:
            f.write(path + "\n")
    
    print(f"Alle paden zijn opgeslagen in {output_file}")
