'use strict';

const { Contract } = require('fabric-contract-api');

class InsuranceContract extends Contract {

    async processPayment(ctx, patientId, amount) {
        const patientExists = await this.patientExists(ctx, patientId);
        if (!patientExists) {
            throw new Error(`Patient with ID ${patientId} does not exist.`);
        }

        const verificationResult = await this.verifyPatient(ctx, patientId);
        if (!verificationResult) {
            throw new Error(`Patient with ID ${patientId} could not be verified.`);
        }

        const insuranceCompany = this.getInsuranceCompany(ctx);
        await this.transferPayment(ctx, insuranceCompany, patientId, amount);
    }

    async patientExists(ctx, patientId) {
        const buffer = await ctx.stub.getState(patientId);
        return !!buffer && buffer.length > 0;
    }
    
    async getInsuranceCompany(ctx) {
        const cid = new ClientIdentity(ctx.stub);
        const mspId = cid.getMSPID();
        if (mspId !== 'InsuranceMSP') {
            throw new Error('Caller is not authorized to perform this operation.');
        }
        return 'InsuranceCompany123';
    }

    async transferPayment(ctx, fromId, toId, amount) {
        const fromBuffer = await ctx.stub.getState(fromId);
        if (!fromBuffer || fromBuffer.length === 0) {
            throw new Error(`Account with ID ${fromId} does not exist.`);
        }
        const fromValue = parseInt(fromBuffer.toString());

        const toBuffer = await ctx.stub.getState(toId);
        if (!toBuffer || toBuffer.length === 0) {
            throw new Error(`Account with ID ${toId} does not exist.`);
        }
        const toValue = parseInt(toBuffer.toString());

        if (fromValue < amount) {
            throw new Error(`Account with ID ${fromId} has insufficient balance.`);
        }

        const newFromValue = fromValue - amount;
        const newToValue = toValue + amount;

        await ctx.stub.putState(fromId, Buffer.from(newFromValue.toString()));
        await ctx.stub.putState(toId, Buffer.from(newToValue.toString()));
    }
}

module.exports = InsuranceContract;
