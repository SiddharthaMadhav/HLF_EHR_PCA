'use strict';

const { Contract } = require('fabric-contract-api');

class HospitalContract extends Contract {

    async initLedger(ctx){
        console.info('============= START : Initialize Ledger ===========');
    
        console.info('============= END : Initialize Ledger ===========');
    }

    async bookLabTest(ctx, patientId, test, cost){
        const patient = await ctx.stub.getState(patientId);
        const doctor = await ctx.stub.getState(doctorId);
        const patient_record = JSON.parse(patient.toString());
        const doctor_record = JSON.parse(doctor.toString());
        let id = 'LAB' + patientId.char(7);
        const labTest = {
            pId: patientId,
            test_name: test,
            test_cost: cost
        }
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(labTest)));
        return JSON.stringify(labTest);
    }

}

module.exports = HospitalContract;