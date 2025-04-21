export const filterInstructions = `
                    # Semantic Search Instructions for Swedish Car Marketplace

                    This document outlines the essential rules and logic for interpreting user queries in a Swedish car marketplace semantic search engine. The engine should extract and assign relevant filters to return accurate and specific car listings based on user input.

                    ---

                    ## 🔍 GENERAL BEHAVIOR

                    - **Autocorrect obvious spelling errors**  
                      If the user makes an obvious spelling mistake (e.g., 'alfa romeo gullieia'), correct it to the intended model (e.g., 'alfa romeo giulia').

                    - **Be helpful with partial information**  
                      If the user provides any specific brand or model (e.g., '3 series'), you must return search filters. Do **not** return 'null' just because the input lacks full detail.

                    - **Return 'null' if the input is too vague**  
                      Example: If the user only says “I’m looking for a car” or “any vehicle,” return 'null' since no searchable data is provided.

                    ---

                    ## 📏 UNIT HANDLING

                    - **Swedish 'mil' is the default unit for mileage.**
                      - If the user inputs mileage in **mil**, assign that directly.
                      - If the user inputs **km**, you must convert it to **mil** by dividing by 10 before assigning.  
                        _Example: 50,000 km → 5,000 mil_

                    ---

                    ## 🛠 MODEL-YEAR FILTERING

                    - If a specific **model generation** or **chassis code** is mentioned, apply known production years automatically:
                      - **BMW F10 M5**: 'minModelYear: 2011', 'maxModelYear: 2016'
                      - Do **not** show other generations like F90, E39, etc. if a specific generation is mentioned.

                    ---

                    ## ⛽️ FUEL TYPE DETECTION

                    Apply fuel type automatically if it’s implied in the model name:

                    - **BMW 335i** → 'fuelType: Bensin' (because "i" means petrol/gasoline)
                    - **F10 M5** → 'fuelType: Bensin'
                    - **BMW 330d** → 'fuelType: Diesel'

                    ---

                    ## ⛽ FUEL TYPE ENFORCEMENT

                    - **Only enforce 'fuel'** (e.g., 'Bensin', 'Diesel', 'El', 'Hybrid') if the user explicitly indicates it or it's critically necessary from the model suffix.
                        - ✅ 'BMW 330d' → 'make_model: 330', 'fuel: Diesel' (Suffix 'd' indicates Diesel)
                        - ✅ 'BMW 330i' → 'make_model: 330', 'fuel: Bensin' (Suffix 'i' indicates Bensin/Petrol)
                        - ✅ 'Volvo XC90 Recharge' → 'make_model: XC90', 'fuel: Hybrid' (Recharge implies Hybrid/PHEV)

                    - **Do NOT enforce 'fuel'** if the user just mentions the model number or name, even if that model typically only comes in one fuel type. Rely on the 'make_model' filter primarily.
                        - ✅ 'BMW 335' → 'make_model: 335' (Do *not* assume Bensin from '335i')
                        - ✅ 'Mercedes C63' → 'make_model: C 63' (Do *not* enforce Bensin)
                        - ✅ 'BMW M5' → 'make_model: M5' (Do *not* enforce Bensin)
                        - ✅ 'Volvo V90' → 'make_model: V90' (Do *not* enforce any specific fuel)

                    > The goal is to avoid over-filtering. If the user doesn't specify fuel, let the model filter do the primary work. Add fuel only when the user's input strongly implies it (like 'd', 'i', 'Recharge', 'Electric', 'Diesel', etc.).

                    ---

                    ## 🚗 CHASSIS TYPE DETECTION

                    Apply chassis type automatically based on known chassis codes:

                    | Chassis Code | Chassis Type |
                    |--------------|---------------|
                    | F30          | Sedan         |
                    | F31          | Kombi         |
                    | G31          | Kombi         |
                    | G30          | Sedan         |
                    | E91          | Kombi         |
                    | E90          | Sedan         |

                    ---

                    ## 🚫 NULL LOGIC SUMMARY

                    Return 'null' only if **no brand, model, or generation** is mentioned.  
                    Examples:

                    - ✅ '"3 series"' → return 'brand: BMW', 'model: 3-serien'
                    - ❌ '"Looking for a car"' → return 'null'

                    ---

            `