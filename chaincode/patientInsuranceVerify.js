'use strict';

const { Contract } = require('fabric-contract-api');

class PatientContract extends Contract {
  
  async verifyPatientDetails(ctx, patientId) {

    // Check if patient exists
    const patient = await ctx.stub.getState(patientId);
    if (!patient) {
      throw new Error(`Patient with ID ${patientId} does not exist.`);
    }

    // Verify patient details
    if (patient.status === 'verified') {
      return 'Patient details already verified.';
    }

    // Update patient status to verified
    patient.status = 'verified';
    await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(patient)));

    return 'Patient details verified successfully.';
  }

  async forwardRequestToInsurance(ctx, patientId, insuranceCompanyId) {

    // Check if patient exists and is verified
    const patient = await ctx.stub.getState(patientId);
    if (!patient || patient.status !== 'verified') {
      throw new Error('Patient details not verified or patient does not exist.');
    }

    // Forward request to insurance company
    const insuranceCompany = await ctx.stub.getState(insuranceCompanyId);
    if (!insuranceCompany) {
      throw new Error(`Insurance company with ID ${insuranceCompanyId} does not exist.`);
    }
    insuranceCompany.requests.push(patientId);
    await ctx.stub.putState(insuranceCompanyId, Buffer.from(JSON.stringify(insuranceCompany)));

    return `Request successfully forwarded to Insurance Company ${insuranceCompanyId}.`;
  }
}

module.exports = PatientContract;

