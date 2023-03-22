'use strict';

const { Contract } = require('fabric-contract-api');

class LabTestContract extends Contract {

  async requestLabTest(ctx, patientId, pathologyDeptId, testType) {

    // Check that patient and pathology department exist in the ledger
    const patientExists = await this.patientExists(ctx, patientId);
    if (!patientExists) {
      throw new Error(`Patient ${patientId} does not exist`);
    }

    const pathologyDeptExists = await this.pathologyDeptExists(ctx, pathologyDeptId);
    if (!pathologyDeptExists) {
      throw new Error(`Pathology department ${pathologyDeptId} does not exist`);
    }

    // Create a new lab test request with a unique ID
    const labTestRequestId = `LABTEST_${Date.now()}`;
    const labTestRequest = {
      patientId: patientId,
      pathologyDeptId: pathologyDeptId,
      testType: testType,
      status: 'REQUESTED'
    };

    // Add the lab test request to the ledger
    await ctx.stub.putState(labTestRequestId, Buffer.from(JSON.stringify(labTestRequest)));

    // Return the ID of the new lab test request
    return labTestRequestId;
  }

  async getLabTestRequest(ctx, labTestRequestId) {
    const labTestRequestBytes = await ctx.stub.getState(labTestRequestId);
    if (!labTestRequestBytes || labTestRequestBytes.length === 0) {
      throw new Error(`Lab test request ${labTestRequestId} does not exist`);
    }

    return JSON.parse(labTestRequestBytes.toString());
  }

  async updateLabTestRequestStatus(ctx, labTestRequestId, status) {
    const labTestRequest = await this.getLabTestRequest(ctx, labTestRequestId);

    // Check that the lab test request is in a valid state for the requested status
    if (status === 'COMPLETED' && labTestRequest.status !== 'IN_PROGRESS') {
      throw new Error(`Cannot set status to COMPLETED for lab test request ${labTestRequestId} with status ${labTestRequest.status}`);
    }

    // Update the lab test request status
    labTestRequest.status = status;
    await ctx.stub.putState(labTestRequestId, Buffer.from(JSON.stringify(labTestRequest)));
  }

  async patientExists(ctx, patientId) {
    const patient = await ctx.stub.getState(patientId);
    return patient && patient.length > 0;
  }

  async pathologyDeptExists(ctx, pathologyDeptId) {
    const pathologyDept = await ctx.stub.getState(pathologyDeptId);
    return pathologyDept && pathologyDept.length > 0;
  }

}

module.exports = LabTestContract;

