'use strict';

const { Contract } = require('fabric-contract-api');

class HospitalContract extends Contract {

    async enrollPatient(ctx, patientId, name, dateOfBirth, gender, address) {
        const exists = await this.patientExists(ctx, patientId);
        if (exists) {
            throw new Error(`The patient with ID ${patientId} already exists.`);
        }

        const patient = {
            patientId,
            name,
            dateOfBirth,
            gender,
            address,
            enrollmentDate: new Date().toISOString()
        };

        await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(patient)));
        return JSON.stringify(patient);
    }

    async patientExists(ctx, patientId) {
        const buffer = await ctx.stub.getState(patientId);
        return !!buffer && buffer.length > 0;
    }

}

module.exports = HospitalContract;