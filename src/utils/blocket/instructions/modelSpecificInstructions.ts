import { EasyInputMessage } from "openai/resources/responses/responses"

export const modelSpecificInstructionsMap: { [key: string]: string } = {
  "Mercedes-Benz": `
        # Mercedes-Benz Model Handling Instructions for Semantic Search

        These instructions cover how to handle Mercedes-Benz model extraction when using the car marketplace's limited API model set. The focus is on properly resolving AMG models and working around API limitations.

        ---

        ## 🧠 GENERAL OVERVIEW

        - The API has **limited model options** for Mercedes-Benz.
        - **AMG models** are **not listed individually** (e.g., 'E 63', 'C 63', etc.).
        - All AMG models are grouped under a generic enum: 'AMG-Modeller'.

        ---

        ## ⚙️ HANDLING AMG MODELS

        ### ✅ IF USER ENTERS A SPECIFIC AMG MODEL (e.g., C 63, E 63, CLA 45)

        - Return:
          - 'make_model: AMG-Modeller'
          - 'search_text: <extracted_model>' (e.g., 'C 63', 'E 63', etc.)

        **Example:**

        User input: "C 63 AMG W204"  
        → Output:  
        make_model: AMG-Modeller  
        search_text: C 63

        > ✅ This ensures the listing is filtered to AMG models via the 'make_model', but refined using 'search_text' to match only the intended one (e.g., 'C 63' and not 'E 63').

        ---

        ## ❗ IMPORTANT RULES

        - Only apply this logic if the **specific model mentioned by the user is not part of the available API enum**.
        - Do **not** try to force-match 'C 63', 'E 63', etc. to a nonexistent model enum.
        - Do **not** leave out 'search_text' — it’s necessary to ensure results are precise within 'AMG-Modeller', but ofcourse if user is writing that they are intrested in ANY amg model, then you can leave the 'search_text' as null.
        

        ---

        ## 🧪 EXAMPLES

        | User Input                | make_model     | search_text |
        |---------------------------|----------------|-------------|
        | "Looking for a C63 AMG"   | AMG-Modeller   | C 63        |
        | "E63 S 4MATIC+ 2020"      | AMG-Modeller   | E 63        |
        | "W204 C 63 performance"    | AMG-Modeller  | C 63        |
        | "I want a CLA45 AMG"      | AMG-Modeller   | CLA 45      |
        | "I'm looking for any AMG" | AMG-Modeller   | null        |
        | "I'm looking an AMG"      | AMG-Modeller   | null        |

        ---

        ### ⛔️ DO NOT MAP AMG MODELS TO GENERIC CLASSES

        - Do **not** convert specific AMG models (e.g., 'C 63', 'E 63') into their generic class equivalents (e.g., 'C-Klass', 'E-Klass').
        - Even if the model shares a chassis with a class (e.g., C 63 with C-Klass), **do not use the generic class in 'search_text'**.
        - Use only the specific AMG identifier (e.g., 'C 63') as 'search_text' if it was mentioned in the user input.

        **Bad:**  
        search_text: C-Klass ❌

        **Good:**  
        search_text: C 63 ✅

        ---

        ## ⚠️ SUMMARY

        - Use 'make_model: AMG-Modeller' for all specific AMG inputs not present in the API enum.
        - Always include a refined 'search_text' to isolate results to the user’s intent.
        - This workaround avoids showing irrelevant AMG models while still working within API limitations.

        ---
  `
}

export const getModelSpecificInstructions = (make_brand: string[]): EasyInputMessage[] | null => {
  const allInstructions = make_brand.map((brand) => {
    const instructions = modelSpecificInstructionsMap[brand];

    if (!instructions) return null

    const obj: EasyInputMessage = {
      role: "system",
      content: [{
        type: "input_text",
        text: modelSpecificInstructionsMap[brand]
      }],
    }

    return obj
  }).filter((msg) => msg !== null)

  return allInstructions

}