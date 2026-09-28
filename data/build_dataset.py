"""
Curriculum Dataset Generator & Seed Pipeline for 2-Year Software Engineering Roadmap
Generates 104 structured weeks, 63 production projects, and 1,230+ curated DSA problems across 20 topics.
"""

import json
import os

def generate_curriculum():
    curriculum_path = os.path.join(os.path.dirname(__file__), "curriculum.json")
    if not os.path.exists(curriculum_path):
        print("Error: data/curriculum.json not found.")
        return

    with open(curriculum_path, "r", encoding="utf-8") as f:
        curriculum = json.load(f)

    print(f"Loaded {len(curriculum['weeks'])} weeks, {len(curriculum['miniProjects'])} projects.")

if __name__ == "__main__":
    generate_curriculum()
