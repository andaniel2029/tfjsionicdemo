import {Component} from '@angular/core';
import {IonicPage, AlertController} from 'ionic-angular';
import {DropDownSelect} from "./DropDownSelect";
import {Label} from "./Label";
import {HttpClient} from "@angular/common/http";
import {LoadingServiceProvider} from "../../providers/loading-service/loading-service";
import * as tf from "@tensorflow/tfjs";

@IonicPage()
@Component({
    selector: 'page-tfpretrainedversion',
    templateUrl: 'tfpretrainedversion.html',
})
export class TfpretrainedversionPage {

    selectedDataSet: string;
    testDataSetDropDownSelect: DropDownSelect[] = [];

    preTrainedModel: tf.Model;
    PRE_TRAINED_MODEL_JSON = 'assets/model/model.json';

    scorecard: any = [];
    accuracyResult;
    predictResultLabelList: Label[] = [];

    constructor(private httpClient: HttpClient,
                private alertCtrl: AlertController,
                private loadingService: LoadingServiceProvider) {
        this.testDataSetDropDownSelect = [
            {"id": "Test10", "value": "assets/dataset/mnist_test_10.csv"},
            {"id": "Test30", "value": "assets/dataset/mnist_test_30.csv"},
            {"id": "Test50", "value": "assets/dataset/mnist_test_50.csv"},
            {"id": "Test100", "value": "assets/dataset/mnist_test_100.csv"}
        ];

        this.loadPreTrainedModel();
    }

    loadPreTrainedModel() {
        tf.loadModel(this.PRE_TRAINED_MODEL_JSON)
            .then((result) => {
                this.preTrainedModel = result;
            })
            .catch((error) => {
                let prompt = this.alertCtrl.create({
                    title: 'Error',
                    subTitle: error,
                    buttons: ['OK']
                });
                prompt.present();
            });
    }

    testPreTrainedModel() {
        this.predictResultLabelList = [];
        this.loadingService.showLoader("Predicting...");
        this.httpClient.get(this.selectedDataSet, {responseType: 'text'})
            .subscribe((data) => {
                this.fit(this.makeLabelAndTestTensor(this.parseCSVFile(data)));
                this.loadingService.hideLoader();
            }, (error) => {
                let prompt = this.alertCtrl.create({
                    title: 'Error',
                    subTitle: 'File not found in the path',
                    buttons: ['OK']
                });
                prompt.present();
            });
    }

    makeLabelAndTestTensor(csvData) {
        let testArray = [];
        let labelArray = [];
        for (let d of csvData) {
            let labelTensorR2 = this.makeLabelTensor(d[0]);
            let testTensorR2 = this.makeTargetTensor(d.slice(1));
            testArray.push(testTensorR2);
            labelArray.push(labelTensorR2);
        }
        return [testArray, labelArray];
    }

    private makeTargetTensor(arrayData) {
        return tf.tensor1d(arrayData).div(tf.scalar(255.0)).mul(tf.scalar(0.99)).add(tf.scalar(0.01)).expandDims(0);
    }

    private makeLabelTensor(labelData) {
        let defaultTargetValue = [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01]
        let tb = new tf.TensorBuffer([10], "float32", Float32Array.from(defaultTargetValue));
        tb.set(0.99, labelData);
        return tb.toTensor().expandDims(0);
    }

    fit(testingAndLabelDataSet) {
        let testArray = testingAndLabelDataSet[0];
        let labelArray = testingAndLabelDataSet[1];

        this.scorecard = [];
        for (let i = 0; i < testArray.length; i++) {
            let correctLabel = labelArray[i].argMax().get(); // argMax().get() doesn't work anymore, it shouldn't use
            let result: any = this.predictNumberWithKerasNN(testArray[i]);

            let label = new Label();
            label.xtest = correctLabel;
            label.ylabel = result.argMax().get();
            label.correct = label.xtest == label.ylabel;
            this.predictResultLabelList.push(label);

            if (correctLabel == result.argMax().get()) {
                this.scorecard.push(1);
            } else {
                this.scorecard.push(0);
            }
        }
        this.accuracyResult = ((this.scorecard.reduce((sum, current) => sum + current, 0)) / this.scorecard.length) * 100 + " %";
    }

    predictNumberWithKerasNN(input) {
        // The first value "1" [1, 28, 28, 1] is meaningless however without it,
        // it throws 'Error: Shapes can not be <= 0. Found 0 at dim 0' error
        // check model.json "batch_input_shape" tag. [null, 28, 28, 1]
        return this.preTrainedModel.predict(input.reshape([1, 28, 28, 1]));
    }

    parseCSVFile(csvString): any {
        let result = [];
        let row = 0;
        let col = 0;

        for (let i = 0; i < csvString.length; i++) {
            let currentChar = csvString[i];
            result[row] = result[row] || [];
            result[row][col] = result[row][col] || '';

            if (currentChar == ',') {
                ++col;
                continue;
            }

            if (currentChar == '\n') {
                ++row;
                col = 0;
                continue;
            }
            result[row][col] += currentChar;
        }
        return result;
    }

}
