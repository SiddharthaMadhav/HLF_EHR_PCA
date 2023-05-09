'use strict';

const { Contract } = require('fabric-contract-api');

class InsuranceContract extends Contract {

    async initLedger(ctx){
        console.info('============= START : Initialize Ledger ===========');
        
        console.info('============= END : Initialize Ledger ===========');
    }


    async claimInsurance(ctx, patientId, price){
        const patient = await ctx.stub.getState(patientId);
        const doctor = await ctx.stub.getState(doctorId);
        const patient_record = JSON.parse(patient.toString());
        const doctor_record = JSON.parse(doctor.toString());
        let id = 'INSR' + patientId.charAt(7);
        const insurance = {
            pId: patientId,
            amount: price,
        }
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(insurance)));
        return JSON.stringify(insurance);
    }


}

module.exports = InsuranceContract;