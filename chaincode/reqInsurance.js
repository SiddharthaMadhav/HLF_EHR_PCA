'use strict';

const { Contract } = require('fabric-contract-api');

class InsuranceContract extends Contract {

  async requestInsuranceAmount(ctx, patientId, hospitalId, amount) {

    // Check that patient and hospital exist in the ledger
    const patientExists = await this.patientExists(ctx, patientId);
    if (!patientExists) {
      throw new Error(`Patient ${patientId} does not exist`);
    }

    const hospitalExists = await this.hospitalExists(ctx, hospitalId);
    if (!hospitalExists) {
      throw new Error(`Hospital ${hospitalId} does not exist`);
    }

    // Get the current balance of the hospital
    const hospitalBalance = await this.getHospitalBalance(ctx, hospitalId);

    // Check that the hospital has enough funds to cover the requested amount
    if (hospitalBalance < amount) {
      throw new Error(`Hospital ${hospitalId} does not have enough funds`);
    }

    // Update the balances of the hospital and patient
    await this.updateBalances(ctx, patientId, hospitalId, amount);

    // Return a success message
    return `Insurance request for patient ${patientId} for hospital ${hospitalId} for amount ${amount} was successful.`;
  }

  async updateBalances(ctx, patientId, hospitalId, amount) {
    // Get the current balances of the patient and hospital
    const patientBalance = await this.getPatientBalance(ctx, patientId);
    const hospitalBalance = await this.getHospitalBalance(ctx, hospitalId);

    // Update the balances
    const updatedPatientBalance = patientBalance + amount;
    const updatedHospitalBalance = hospitalBalance - amount;

    // Update the ledger with the new balances
    await ctx.stub.putState(patientId, Buffer.from(updatedPatientBalance.toString()));
    await ctx.stub.putState(hospitalId, Buffer.from(updatedHospitalBalance.toString()));
  }

  async getPatientBalance(ctx, patientId) {
    const balance = await ctx.stub.getState(patientId);
    return parseInt(balance.toString());
  }

  async getHospitalBalance(ctx, hospitalId) {
    const balance = await ctx.stub.getState(hospitalId);
    return parseInt(balance.toString());
  }

  async patientExists(ctx, patientId) {
    const patient = await ctx.stub.getState(patientId);
    return patient && patient.length > 0;
  }

  async hospitalExists(ctx, hospitalId) {
    const hospital = await ctx.stub.getState(hospitalId);
    return hospital && hospital.length > 0;
  }

}

module.exports = InsuranceContract;
