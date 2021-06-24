import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { AuthService } from 'src/app/services/auth.service';
import { TimerService } from 'src/app/services/timer.service';
import { Timer } from 'src/app/utils/timer.interface';
import { User } from 'src/app/utils/user.interface';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-focus-page',
  templateUrl: './focus-page.component.html',
  styleUrls: ['./focus-page.component.css']
})
export class FocusPageComponent implements OnInit {
  public timer: number;
  public started: boolean;
  private countInterval: any;
  public minutes: string;
  public seconds: string;
  private previousTime = { minutes: '25', seconds: '00'};
  public formTimers: FormGroup;
  public panelOpenState = true;
  public panelOpenStateList = true;
  private countPomodoros = 0 ;
  private audio = new Audio('assets/audio/alerta.mp3');
  private userId: string;
  public inputTouched = false;
  public timers: Array<Timer> = [];
  public breaks: Array<Timer> = [];
  public editTimerStatus = false;
  private editTimerId = '';


  constructor(
    public authService: AuthService,
    public timerService: TimerService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationsService) {
    const userData = JSON.parse(localStorage.getItem('user') || '');
    this.userId = userData._id;
    this.timer = 1500;
    this.started = false;
    this.minutes = '25';
    this.seconds = '00';
    this.countInterval = null;
    this.formTimers = this.formBuilder.group({
      'subject': '',
      'minutes': [20],
      'seconds': [0],
      'type': 0,
      'userId': this.userId
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getAllTimers();
    this.getAllBreaks();
  }

  private initializeForm() {
    this.formTimers = this.formBuilder.group({
      'subject': '',
      'minutes': ['20'],
      'seconds': ['00'],
      'type': 0,
      'userId': this.userId
    });
  }

  getAllTimers() {
    this.timerService.getTimerByType(0).subscribe(res => {
      this.timers = res.timers;
    }, err => {
      this.notificationService.error('Error', err.msg );
    });
  }

  getAllBreaks() {
    this.timerService.getTimerByType(1).subscribe(res => {
      this.breaks = res.timers;
    }, err => {
      this.notificationService.error('Error', err.msg );
    });
  }

  timerControls() {
    if (Number(this.minute.value) === 0 && Number(this.second.value) === 0) {
      this.notificationService.error('Error', 'El timer no puede ejecutar dicha acción');
    } else if (!this.started) this._startTimer();
    else this._stopTimer();
  }

  private _startTimer() {
    this.started = !this.started;
    this.countInterval = setInterval(this._controls, 1000);
  }

  private _stopTimer() {
    this.started = !this.started;
    clearInterval(this.countInterval);
  }

  setTime() {
    if (this.formTimers.valid) {
      if (this.inputTouched && this.editTimerStatus) {
        this.timerService.updateTimer(this.editTimerId, this.formTimers.value).subscribe(res => {
          this.notificationService.success('Exito', res.msg );
          this.type.value === 0 ? this.getAllTimers() : this.getAllBreaks();
          this._setTimeCalculations();
          this.initializeForm();
          this.inputTouched = false;
          this.editTimerStatus = false;
          this.editTimerId = '';
        }, err => {
          this.notificationService.error('Error', err.msg );
        });
      } else if (this.inputTouched) {
        this.timerService.create(this.formTimers.value).subscribe(res => {
          this.notificationService.success('Exito', res.msg );
          this.type.value === 0 ? this.getAllTimers() : this.getAllBreaks();
          this._setTimeCalculations();
          this.initializeForm();
          this.inputTouched = false;
        }, err => {
          this.notificationService.error('Error', err.msg );
        });
      } else {
        this._setTimeCalculations();
      }
    }
  }

  private _setTimeCalculations() {
    let minutes = this.minute.value
    let seconds = this.second.value;
    this.previousTime = { minutes: minutes.value, seconds: seconds.value };
    this.timer = (Number(minutes) * 60) + Number(seconds)
    this._timerCalculations();
  }

  private _controls = () => {
    this.timer = this.timer - 1;
    let result = this._timerCalculations();
    if (result === 0) this.finishedTimer();
  }

  private finishedTimer() {
    this._stopTimer();
    this.startAudioAlert();
    this._finishedNotification();
    this.countPomodoros++;
    if (this.countPomodoros > 2) {
      Swal.fire({
        title: 'Te recomendamos tomarte un pequeño descanso, ¿quieres iniciar un timer de 5 minutos?',
        showDenyButton: true,
        confirmButtonText: `Si`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.minute.setValue('05');
          this.second.setValue('00');
          this.setTime();
          this.timerControls();
        } else if (result.isDenied) {
          this.notificationService.info('Info', 'Recuerda tomar un pequeño descanso de 15 a 20 minutos por cada dos a tres intervalos de pomodoro');
        }
      });
      this.countPomodoros = 0;
    }
  }

  private _finishedNotification() {
    this.notificationService.info('Alerta', 'Tu tiempo ha llegado a cero', {
      position: ['top', 'left'],
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true
    });
    setTimeout(() => {
      this.stopAudioAlert();
    }, 5000);
  }

  private _timerCalculations() {
    let minute = Math.floor(this.timer / 60);
    let second = Math.floor(this.timer % 60);
    this.minutes = minute.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    this.seconds = second.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    return minute + second;
  }

  private startAudioAlert() {
    this.audio.play();
  }

  private stopAudioAlert() {
    this.audio.pause();
  }

  togglePanel(status: boolean) {
    this.panelOpenState = status;
  }

  togglePanelList(status: boolean) {
    this.panelOpenStateList = status;
  }

  get minute() {
    return this.formTimers.controls['minutes'];
  }

  get second() {
    return this.formTimers.controls['seconds'];
  }

  get subject() {
    return this.formTimers.controls['subject'];
  }

  get type() {
    return this.formTimers.controls['type'];
  }

  timerChangeEvent(event: Event) {
    this.inputTouched = this.subject.value.length > 0;
  }

  useTimer(timer: Timer) {
    let minutes = timer.minutes
    let seconds = timer.seconds;
    this.previousTime = { minutes: minutes, seconds: seconds };
    this.timer = (Number(minutes) * 60) + Number(seconds)
    this._timerCalculations();
    document.getElementById('startTimerBtn')?.click();
    this.togglePanel(!this.started);
  }

  editTimer(timer: any) {
    const formTime = {
      subject: timer.subject,
      minutes: timer.minutes,
      seconds: timer.seconds,
      type: timer.type,
      userId: timer.userId
    };
    this.formTimers.setValue(formTime);
    this.inputTouched = true;
    this.editTimerStatus = true;
    this.editTimerId = timer._id;
  }

  deleteTimer(timerId: string, type: number) {
    this.timerService.deleteTimer(timerId).subscribe(res => {
      this.notificationService.success('Exito', res.msg );
      type === 0 ? this.getAllTimers() : this.getAllBreaks();
    }, err => {
      this.notificationService.error('Error', err.msg );
    });
  }

}
