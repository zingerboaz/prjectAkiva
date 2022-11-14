import { ActivatedRoute } from '@angular/router';
import { IConclusion } from '../../interfaces/conclusion.interface';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-conclusions',
    templateUrl: './conclusions.component.html',
    styleUrls: ['./conclusions.component.scss']
})
export class ConclusionsComponent implements OnInit {
    conclusions: IConclusion[];
    fields = [
        { name: 'נתונים חינוכיים', content: 'םאיד סילוקאיא סד .האבינ ןונ יסינ םוקנמלא תס .תילא גניסיפידא ררוטקסנוק .קרורב המציש הירקולב וקומצ ,יבננ וקיבל חלמצ וטוסנמ ,אילב שצ ימחשצ תל .חערל .יטרל קירטצת ךקירפל םוטס הנקירב רבולק יטסנונ ,הרקילב סורוק םוטנמידנוק .קילעב םודיט יסילוס םולוביטסו וגואא לאוו סוטקל תגא סארק ,רולוד טא םולוביטסו' },
        { name: 'מדדים לימודיים', content: 'םאיד סילוקאיא סד .האבינ ןונ יסינ םוקנמלא תס .תילא גניסיפידא ררוטקסנוק .קרורב המציש הירקולב וקומצ ,יבננ וקיבל חלמצ וטוסנמ ,אילב שצ ימחשצ תל .חערל .יטרל קירטצת ךקירפל םוטס הנקירב רבולק יטסנונ ,הרקילב סורוק םוטנמידנוק .קילעב םודיט יסילוס םולוביטסו וגואא לאוו סוטקל תגא סארק ,רולוד טא םולוביטסו' },
        { name: 'מדדי צוות המוסד', content: 'םאיד סילוקאיא סד .האבינ ןונ יסינ םוקנמלא תס .תילא גניסיפידא ררוטקסנוק .קרורב המציש הירקולב וקומצ ,יבננ וקיבל חלמצ וטוסנמ ,אילב שצ ימחשצ תל .חערל .יטרל קירטצת ךקירפל םוטס הנקירב רבולק יטסנונ ,הרקילב סורוק םוטנמידנוק .קילעב םודיט יסילוס םולוביטסו וגואא לאוו סוטקל תגא סארק ,רולוד טא םולוביטס' },

    ]

    constructor(private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.activatedRoute.data.subscribe(data => {
            this.conclusions = data['conclusions'];
            this.conclusions.forEach(item => {
              if( item !== null){
                switch (item.type) {
                    case 'SOCIAL':
                        item.title = "נתונים חינוכיים"
                        break;
                    case 'EDUCATION':
                        item.title = 'מדדים לימודיים';
                        break;
                    case 'STAFF':
                        item.title = 'מדדי צוות המוסד';
                        break;
                }
            }
          })
            console.log('conclusions', this.conclusions);

        })
    }

    filterConclusions(){
      return this.conclusions.filter(x => x !== null);
  }


}
