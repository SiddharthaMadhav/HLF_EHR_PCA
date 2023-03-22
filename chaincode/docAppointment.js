'use strict';

const { Contract } = require('fabric-contract-api');

class PatientContract extends Contract {
  
  async forwardRequestToDoctor(ctx, patientId, doctorId) {

    // Check if patient is indoor
    const patient = await ctx.stub.getState(patientId);
    if (!patient || patient.indoor !== true) {
      throw new Error('Patient is not indoor.');
    }

    // Check if doctor is related to patient
    const doctor = await ctx.stub.getState(doctorId);
    if (!doctor || !doctor.specialization.includes(patient.specialization)) {
      throw new Error('Doctor is not related to patient.');
    }

    // Forward request to doctor
    doctor.requests.push(patientId);
    await ctx.stub.putState(doctorId, Buffer.from(JSON.stringify(doctor)));

    return `Request successfully forwarded to Doctor ${doctorId}.`;
  }
}

module.exports = PatientContract;