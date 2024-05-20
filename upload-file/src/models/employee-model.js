import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  Employee_ID: String,
  Employee_Name: String,
  Designation: String,
  Date_Of_Joining: String,
  Month_Year: String,
  No_Of_Days_Worked: Number,
  Account_Number: Number,
  PAN_Number: String,
  Email_ID: String,
  Basic_Pay: Number,
  HRA: Number,
  Conveyance: Number,
  Food_Allowance: Number,
  Education_Allowance: Number,
  Special_Allowance: Number,
  Performance_Bonus: Number,
  Overtime_Pay: Number,
  Total_Earnings: Number,
  EPF: Number,
  ESI: Number,
  TDS: Number,
  Professional_Tax: Number,
  Loss_Of_Pay: Number,
  Salary_In_Advance: Number,
  Other_Deductions: Number,
  Total_Deductions: Number,
  Net_Pay_In_Rupees: Number,
  In_Words: Number,
});

export const Employee = mongoose.model("Employee", employeeSchema);
