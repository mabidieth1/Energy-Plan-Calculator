import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const EnergyPlanForm = ({ onSubmit, initialValues }) => {
  const validationSchema = Yup.object({
    averagePricePerKw: Yup.number()
      .positive("Must be a positive number")
      .required("Required"),
    monthlyUsage: Yup.number()
      .positive("Must be a positive number")
      .required("Required"),
    baseCharge: Yup.number()
      .min(0, "Must be 0 or greater")
      .required("Required"),
  });

  const defaultInitialValues = {
    averagePricePerKw: "",
    monthlyUsage: "",
    baseCharge: "",
  };

  const formInitialValues = { ...defaultInitialValues, ...initialValues };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values }) => (
        <Form className="space-y-4">
          <div>
            <h2>Enter Your Energy Usage Details</h2>
          </div>

          {/* Average Price Per Kilowatt */}
          <div>
            <h3>Average Price Per Kilowatt (Cents)</h3>
            <Field
              type="number"
              name="averagePricePerKw"
              id="averagePricePerKw"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Cost of electricity per kWh"
              step="0.1"
            />
            <ErrorMessage
              name="averagePricePerKw"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Monthly Usage */}
          <div>
            <h3>Monthly Usage (kWh)</h3>
            <Field
              type="number"
              name="monthlyUsage"
              id="monthlyUsage"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Total energy consumed monthly"
            />
            <ErrorMessage
              name="monthlyUsage"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Base Charge */}
          <div>
            <h3>Base Charge ($)</h3>
            <Field
              type="number"
              name="baseCharge"
              id="baseCharge"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Fixed monthly service fee"
              step="0.01"
            />
            <ErrorMessage
              name="baseCharge"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Calculate
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default EnergyPlanForm;
