import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ng-lab-testing-impl';
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSources: MatTableDataSource<AbstractControl>[] = [];
  sampleForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.sampleForm = this.fb.group({
      samples: this.fb.array([]),
    });
    this.addSample();
  }

  addSample() {
    const group = this.fb.group({
      disease: [null],
      sampleType: [null],
      examRows: this.fb.array([]),
    });
    (this.sampleForm.get('samples') as FormArray).push(group);
    this.dataSources.push(new MatTableDataSource<AbstractControl>([]));

    this.addRow(this.dataSources.length - 1);
  }

  deleteSample(i: number) {
    if (this.dataSources.length === 1) {
      (this.sampleForm.get('samples') as FormArray).reset();
      return;
    }
    (this.sampleForm.get('samples') as FormArray).removeAt(i);
    this.dataSources.splice(i, 1);
  }

  addRow(i: number) {
    const group = this.fb.group({
      examType: [null],
      subExamType: [null],
      weight: [null],
    });
    (
      ((this.sampleForm.get('samples') as FormArray).at(i) as FormGroup).get(
        'examRows'
      ) as FormArray
    ).push(group);
    this.dataSources[i].data = (
      ((this.sampleForm.get('samples') as FormArray).at(i) as FormGroup).get(
        'examRows'
      ) as FormArray
    ).controls;

    this.updateTableView(i);
  }

  deleteRow(sampleIndex: number, rowIndex: number) {
    if (this.dataSources[sampleIndex].data.length === 1) {
      (
        (
          (this.sampleForm.get('samples') as FormArray).at(
            sampleIndex
          ) as FormGroup
        ).get('examRows') as FormArray
      ).reset();
      return;
    }
    this.dataSources[sampleIndex].data = this.dataSources[
      sampleIndex
    ].data.filter((_, i) => i !== rowIndex);

    (
      (
        (this.sampleForm.get('samples') as FormArray).at(
          sampleIndex
        ) as FormGroup
      ).get('examRows') as FormArray
    ).removeAt(rowIndex);
    this.updateTableView(sampleIndex);
  }

  updateTableView(i: number) {
    this.dataSources[i]._updateChangeSubscription();
  }

  get sampleControls() {
    return (this.sampleForm.get('samples') as FormArray)
      .controls as FormGroup[];
  }
}
