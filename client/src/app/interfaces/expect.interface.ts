export interface IExpect {
    institution_id: number,
    current_eligible: number,
    current_outstanding: number,
    current_math_4: number,
    current_math_5: number,
    current_eng_4: number,
    current_eng_5: number,
    last_eligible: number,
    last_outstanding: number,
    last_math_4: number,
    last_math_5: number,
    last_eng_4: number,
    last_eng_5: number,
}

export interface IUpdateExpect {
    institution_id: number,
    expect: {
      current_eligible: number,
      current_outstanding: number,
      current_math_4: number,
      current_math_5: number,
      current_eng_4: number,
      current_eng_5: number,
      last_eligible: number,
      last_outstanding: number,
      last_math_4: number,
      last_math_5: number,
      last_eng_4: number,
      last_eng_5: number,
    }
}
