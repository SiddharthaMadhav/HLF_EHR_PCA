'use strict';

const { Contract } = require('fabric-contract-api');

class ChemistContract extends Contract {

    async initLedger(ctx){
        console.info('============= START : Initialize Ledger ===========');
        

        
        console.info('============= END : Initialize Ledger ===========');
    }


    async buyMedicine(ctx, patientId, medicine, cost){
        const patient = await ctx.stub.getState(patientId);
        const doctor = await ctx.stub.getState(doctorId);
        const patient_record = JSON.parse(patient.toString());
        const doctor_record = JSON.parse(doctor.toString());
        let id = patientId.charAt(7);
        const receipt = {
            pId: patientId, 
            medicines: medicine,
            price: cost
        }
        let medid = 'MED'+id;
        await ctx.stub.putState(medid, Buffer.from(JSON.stringify(receipt)));
        return JSON.stringify(receipt);
    }
}

module.exports = ChemistContract;