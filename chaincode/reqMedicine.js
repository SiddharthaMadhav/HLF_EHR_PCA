'use strict';

const { Contract } = require('fabric-contract-api');

class MedicineRequestContract extends Contract {

  async requestMedicine(ctx, patientId, medicineName) {
    const medicineRequestKey = ctx.stub.createCompositeKey('chemist.pca.com', [patientId, medicineName]);
    const medicineRequestExists = await this.medicineRequestExists(ctx, medicineRequestKey);

    if (medicineRequestExists) {
      throw new Error(`Medicine request for patient ${patientId} and medicine ${medicineName} already exists`);
    }

    const medicineRequest = {
      patientId: patientId,
      medicineName: medicineName,
      status: 'REQUESTED'
    };

    await ctx.stub.putState(medicineRequestKey, Buffer.from(JSON.stringify(medicineRequest)));

    return medicineRequest;
  }

  async approveMedicine(ctx, patientId, medicineName) {
    const medicineRequestKey = ctx.stub.createCompositeKey('chemist.pca.com', [patientId, medicineName]);
    const medicineRequest = await this.getMedicineRequest(ctx, medicineRequestKey);

    if (medicineRequest.status !== 'REQUESTED') {
      throw new Error(`Medicine request for patient ${patientId} and medicine ${medicineName} has already been approved or rejected`);
    }

    medicineRequest.status = 'APPROVED';

    await ctx.stub.putState(medicineRequestKey, Buffer.from(JSON.stringify(medicineRequest)));

    return medicineRequest;
  }

  async rejectMedicine(ctx, patientId, medicineName) {
    const medicineRequestKey = ctx.stub.createCompositeKey('chemist.pca.com', [patientId, medicineName]);
    const medicineRequest = await this.getMedicineRequest(ctx, medicineRequestKey);

    if (medicineRequest.status !== 'REQUESTED') {
      throw new Error(`Medicine request for patient ${patientId} and medicine ${medicineName} has already been approved or rejected`);
    }

    medicineRequest.status = 'REJECTED';

    await ctx.stub.putState(medicineRequestKey, Buffer.from(JSON.stringify(medicineRequest)));

    return medicineRequest;
  }

  async getMedicineRequest(ctx, medicineRequestKey) {
    const medicineRequestExists = await this.medicineRequestExists(ctx, medicineRequestKey);

    if (!medicineRequestExists) {
      throw new Error(`Medicine request ${medicineRequestKey} does not exist`);
    }

    const medicineRequestBuffer = await ctx.stub.getState(medicineRequestKey);
    const medicineRequest = JSON.parse(medicineRequestBuffer.toString());

    return medicineRequest;
  }

  async medicineRequestExists(ctx, medicineRequestKey) {
    const medicineRequestBuffer = await ctx.stub.getState(medicineRequestKey);
    return medicineRequestBuffer && medicineRequestBuffer.length > 0;
  }

}

module.exports = MedicineRequestContract;

