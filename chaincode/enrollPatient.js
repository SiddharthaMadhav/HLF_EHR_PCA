'use strict';

const { Contract } = require('fabric-contract-api');

class HospitalContract extends Contract {

    async initLedger(ctx){
        console.info('============= START : Initialize Ledger ===========');
        const doctors = [
            {
                name: 'Doctor1',
                hospital: 'kamakshi',
                fee: '500',
                spec: 'CARD',
            },
            {
                name: 'Doctor2',
                hospital: 'apollo',
                fee: '700',
                spec: 'ORTH',
            },
            {
                name: 'Doctor3',
                hospital: 'global',
                fee: '600',
                spec: 'NEUR',
            }
        ]
        const patients = [
            {
                name: 'Nanda',
                previousDebt: '100',
                disease: 'Eye',
                no_of_apps : 0,
                med_bought: '',
                lab_tests: ''
            },
            {
                name: 'Siddhartha',
                previousDebt: '120',
                disease: 'Nothing',
                no_of_apps : 0
            },
            {
                name: 'Kishore',
                previousDebt: '100',
                disease: 'Nose',
                no_of_apps: 0
            }
        ]

        for (let i = 0; i < patients.length; i++) {
            patients[i].docType = 'patient';
            await ctx.stub.putState('PATIENT' + i, Buffer.from(JSON.stringify(patients[i])));
            console.info('Added <--> ', patients[i]);
        }
        for (let i = 0; i < doctors.length; i++) {
            doctors[i].docType = 'doctors';
            await ctx.stub.putState('DOCTOR' + i, Buffer.from(JSON.stringify(doctors[i])));
            console.info('Added <--> ', doctors[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async addPatient(ctx, id, name, prev_debt, disease) {
        const exists = await this.patientExists(ctx, id);
        if (exists) {
            throw new Error(`The patient with ID ${id} already exists.`);
        }

        const patient = {
            name,
            prev_debt,
            disease
        };

        await ctx.stub.putState('PATIENT11', Buffer.from(JSON.stringify(patient)));
        return JSON.stringify(patient);
    }

    async patientExists(ctx, name) {
        const buffer = await ctx.stub.getState(name);
        return !!buffer && buffer.length > 0;
    }

    async bookAppointment(ctx, patientId, doctorId, insurance, desc){
        const patient = await ctx.stub.getState(patientId);
        const doctor = await ctx.stub.getState(doctorId);
        const patient_record = JSON.parse(patient.toString());
        const doctor_record = JSON.parse(doctor.toString());
        let id = patientId.charAt(7);
        let appid = 'APP' + id;
        const appointment = {
            patient_id: patientId,
            status: 'Booked',
            Insured: insurance,
            description: desc
        }
        await ctx.stub.putState(appid, Buffer.from(JSON.stringify(appointment)));
        return JSON.stringify(appointment);
    }

    async buyMedicine(ctx, patientId, medicine, cost){
        const patient = await ctx.stub.getState(patientId);
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

    async claimInsurance(ctx, patientId, price){
        const patient = await ctx.stub.getState(patientId);
        let id = 'INSR' + patientId.charAt(7);
        const insurance = {
            pId: patientId,
            amount: price,
        }
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(insurance)));
        return JSON.stringify(insurance);
    }

    async bookLabTest(ctx, patientId, test, cost){
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