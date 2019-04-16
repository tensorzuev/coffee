import * as React from 'react';
import { IFilterStat, IInterval } from '../../DataStorage';
import './Filter.less';
import {default as Button} from '@material-ui/core/Button';
import { Spinner } from '../../Elements/Spinner';

interface IFilterState {
    editMode: boolean,
    cookingDuration: IInterval[],
    validation: {[propertyname:string]:string},
    filterDump: IFilterStat,
    isDay: boolean,
    isWeek: boolean,
    isMonth: boolean,
    periodShowed: boolean
}

interface IFilterProps {
    filter: IFilterStat
    filterChangeCallback: (filter:any)=>void
}

function getDate(date:Date):string {
    const dateToJSON = new Date(+date - date.getTimezoneOffset()*60*1000);
    return dateToJSON.toJSON().split('T')[0];
}

const durationHour = 3600000;
const durationDay = 86399999;

function getToday():Date {
    let today = new Date();
    today.setHours(23);
    today.setMinutes(59);
    today.setSeconds(59);
    today.setMilliseconds(999);
    return today;
}

function getStartOfDay():Date {
    return new Date(+getToday() - durationDay)
}

function getWeekDay():Date {
    return new Date(+getToday() - durationDay - 24*6*durationHour)
}

function getMonthDay():Date {
    let start = new Date(+getToday() - durationDay);
    let month = start.getMonth();
    month--;
    if (month < 0) {
        month = 11;
        let year = start.getFullYear();
        year--;
        start.setFullYear(year);
    }
    start.setMonth(month);
    return start;
}

export class Filter extends React.Component<IFilterProps, IFilterState> {

    state:IFilterState = {
        editMode: false,
        cookingDuration: [],
        validation: {},
        filterDump: null,
        periodShowed: false,
        isDay: false,
        isWeek: false,
        isMonth: true
    }

    formRef:React.RefObject<HTMLFormElement> = React.createRef();
    formPeriodRef:React.RefObject<HTMLFormElement> = React.createRef();

    
    constructor(props:any) {
        super(props);
        this.changeEditMode = this.changeEditMode.bind(this);
        this.saveFilter = this.saveFilter.bind(this);
        this.cancel = this.cancel.bind(this);
        this.setWeekRange = this.setWeekRange.bind(this);
        this.setMonthRange = this.setMonthRange.bind(this);
        this.setDayRange = this.setDayRange.bind(this);
        this.addCookingDuration = this.addCookingDuration.bind(this);
        this.changeGroupBy = this.changeGroupBy.bind(this);
        this.openChangePeriod = this.openChangePeriod.bind(this);
        this.setPeriodOfDate = this.setPeriodOfDate.bind(this);
        this.keyDownAddFilter = this.keyDownAddFilter.bind(this);
        document.addEventListener('keydown', this.keyDownAddFilter);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyDownAddFilter);
    }

    keyDownAddFilter(ev:any) {
        if (ev.key === 'Escape' && this.state.editMode) {
            this.changeEditMode();
        }
    }

    openChangePeriod() {
        this.setState({
            periodShowed: true
        })
    }

    changeGroupBy() {
        let newFilter = Object.assign({}, this.props.filter);
        //@ts-ignore
        newFilter.groupBy = +this.formPeriodRef.current.elements.groupBy.value;
        this.props.filterChangeCallback(newFilter);
    }

    setPeriodOfDate() {
        let newFilter = Object.assign({}, this.props.filter);

        //@ts-ignore
        newFilter.periodStart = new Date(this.formPeriodRef.current.elements.periodStart.value);
        newFilter.periodStart.setHours(0);
        newFilter.periodEnd.setMinutes(0);
        newFilter.periodEnd.setSeconds(0);
        newFilter.periodEnd.setMilliseconds(0);
        
        //@ts-ignore
        newFilter.periodEnd = new Date(this.formPeriodRef.current.elements.periodEnd.value);
        newFilter.periodEnd.setHours(23);
        newFilter.periodEnd.setMinutes(59);
        newFilter.periodEnd.setSeconds(59);
        newFilter.periodEnd.setMilliseconds(999);

        let newValidation = Object.assign({}, this.state.validation);
        if (newFilter.periodStart > newFilter.periodEnd) {
            newValidation.period = 'Ошибка: дата начала должна быть меньше даты конца.';
        } else {
            newValidation.period = '';
            this.props.filterChangeCallback(newFilter);            
        }
        this.setState({
            validation: newValidation,
            periodShowed: true
        });
    }

    setInputValues(start:Date, end:Date) {
        let newFilter = Object.assign({}, this.props.filter);
        newFilter.periodStart = start;
        newFilter.periodEnd = end;
        this.setState({
            periodShowed: false
        });
        this.props.filterChangeCallback(newFilter);
    }
    
    setDayRange() {
        this.setInputValues(getStartOfDay(), getToday());
    }

    setWeekRange() {
        this.setInputValues(getWeekDay(), getToday());
    }

    setMonthRange() {
        this.setInputValues(getMonthDay(), getToday());  
    }
    

    changeEditMode() {
        let filterDump;

        if (this.state.editMode) {
            filterDump = null;
        } else {
            filterDump = Object.assign({}, this.props.filter);
        }
        this.setState({
            validation: {},
            editMode: !this.state.editMode,
            cookingDuration: this.props.filter.intervals.slice(),
            filterDump: filterDump
        });

    }

    cancel(ev:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        this.changeEditMode();
        ev.preventDefault();  
    }

    saveFilter(ev:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        let newFilter = Object.assign({}, this.props.filter);
        
        this.props.filterChangeCallback(newFilter);
        this.changeEditMode();
        ev.preventDefault();  
    }

    getButton() {
        if (this.props.filter) {
            return (<button type="button" 
                aria-label="открыть панель с дополнительными настройками"    
                className={'btn waves-effect btn-sm btn-outline-' + (this.state.editMode ? 'success':'info')} onClick={this.changeEditMode}>настроить</button>);
        } else {
            return ('');
        }
    }
    static getDerivedStateFromProps(props:IFilterProps) {
        const today = getToday();
        const isDay = props.filter && +props.filter.periodEnd === +today && +props.filter.periodStart === +getStartOfDay();
        const isWeek = props.filter && +props.filter.periodEnd === +today && +props.filter.periodStart === +getWeekDay();
        const isMonth = props.filter && +props.filter.periodEnd === +today && +props.filter.periodStart === +getMonthDay();
        return {
            isDay: isDay,
            isWeek: isWeek,
            isMonth: isMonth
        }
    }

    getFilterPresentation() {
        if (!this.props.filter) {
            return (<Spinner />);
        } else {
            //tODO: посчитать активную кнопку
            
            return (
                <form ref={this.formPeriodRef}>
                    <fieldset>
                        <div className='filter__period'>
                            <legend className="sr-only">Период статистики</legend>
                            <div className="btn-group mb-2 mr-2" role="radiogroup" aria-label="установить промежуток статистики. Доступен выбор: сегодня, неделю, месяц, произвольный период">
                                <label className={'filter__period-button btn btn-info form-check-label btn-sm' + (this.state.isDay && !this.state.periodShowed?' active':'')}>
                                    <input id='periodByDay' type='radio' name='period' value='day'
                                        className='form-check-input'
                                        aria-label="статистика за сегодня"
                                        onChange={this.setDayRange}
                                        checked={this.state.isDay && !this.state.periodShowed} />сегодня
                                </label>
                                <label className={'filter__period-button btn btn-info form-check-label btn-sm' + (this.state.isWeek && !this.state.periodShowed?' active':'')}>
                                    <input id='periodByWeek' type='radio' name='period' value='week'
                                        className='form-check-input'
                                        aria-label="статистика за неделю"
                                        onChange={this.setWeekRange}
                                        checked={this.state.isWeek && !this.state.periodShowed} />неделя
                                </label>
                                <label className={'filter__period-button btn btn-info form-check-label btn-sm' + (this.state.isMonth && !this.state.periodShowed?' active':'')}>
                                    <input id='periodByMonth' type='radio' name='period' value='month'
                                        className='form-check-input'
                                        aria-label="статистика за месяц"
                                        onChange={this.setMonthRange}
                                        checked={this.state.isMonth && !this.state.periodShowed} />месяц
                                </label>
                                <label className={'filter__period-button btn btn-info form-check-label btn-sm' + 
                                (this.state.periodShowed || (!this.state.isDay && !this.state.isWeek && !this.state.isMonth) ?' active':'')}>
                                    <input id='periodByPeriod' type='radio' name='period' value='period'
                                        className='form-check-input'
                                        aria-label="статистика за произвольный период"
                                        onChange={this.openChangePeriod}
                                        checked={this.state.periodShowed || (!this.state.isDay && !this.state.isWeek && !this.state.isMonth)} />период
                                </label>
                            </div>

                                
                            {this.state.periodShowed || (!this.state.isDay && !this.state.isWeek && !this.state.isMonth) ? 
                                <React.Fragment>
                                    <div className='md-form'>
                                        <input type="date" id="periodStart" className="form-control" 
                                            onChange={this.setPeriodOfDate}
                                            defaultValue={getDate(this.props.filter.periodStart)}/>
                                        <label htmlFor="periodStart" className='active'>Начало</label>
                                    </div>
                                    <div className='md-form'>
                                        <input type="date" id="periodEnd" className="form-control" 
                                            onChange={this.setPeriodOfDate}
                                            defaultValue={getDate(this.props.filter.periodEnd)}/>
                                        <label htmlFor="periodEnd" className='active'>Окончание</label>
                                    </div>
                                    <div className='md-form'>
                                        {
                                            this.state.validation.period ? 
                                                <div className="alert alert-danger" role="alert">{this.state.validation.period}</div>
                                                : ''
                                        }
                                    </div>
                                </React.Fragment>
                                : ''}

                            
                            <div className='btn-group mr-2 mb-2' role="radiogroup" aria-label="доступен выбор по часам или дням">
                                <label className={'btn btn-info form-check-label btn-sm' + ((this.props.filter.groupBy === 1)?' active':'')}>
                                    <input id='groupByHour' type='radio' name='groupBy' value='1'
                                        className='form-check-input'
                                        onChange={this.changeGroupBy}
                                        checked={this.props.filter.groupBy === 1} /> по&nbsp;часам
                                </label>
                                <label className={'btn btn-info form-check-label btn-sm' + ((this.props.filter.groupBy === 24)?' active':'')}>
                                    <input id='groupByDay' type='radio' name='groupBy' value='24'
                                        className='form-check-input'
                                        onChange={this.changeGroupBy}
                                        checked={this.props.filter.groupBy === 24} /> по&nbsp;дням
                                </label>
                            </div>
                            <div className='btn-group mb-2'>
                                {this.getButton()}
                            </div>
                        </div>
                        
                    </fieldset>
                </form>
            );
        }
    }

    current() {
        return (
            <article>
                {this.getFilterPresentation()}
            </article>
        )
    }

    deleteOneInterval(el:IInterval, ev:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        this.state.cookingDuration.splice(this.state.cookingDuration.indexOf(el), 1);
        this.setState({
            cookingDuration: this.state.cookingDuration.slice()
        });
        ev.preventDefault();
    }

    addCookingDuration(ev:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        //@ts-ignore
        const startTime = +this.formRef.current.elements.durationAddStart.value;
        //@ts-ignore
        const endTime = +this.formRef.current.elements.durationAddEnd.value;
        if (startTime >= endTime || startTime < 1) {
            let newValidation = Object.assign({}, this.state.validation);
            newValidation.cookingDuration = 'Ошибка: некорректный интервал';            
            this.setState({
                validation: newValidation
            });
        } else {
            this.state.cookingDuration.push({
                start: startTime,
                end: endTime,
            });
            let newValidation = Object.assign({}, this.state.validation);
            delete newValidation.cookingDuration;
            this.setState({
                cookingDuration: this.state.cookingDuration.slice(),
                validation: newValidation
            });
            //@ts-ignore
            this.formRef.current.elements.durationAddStart.value = '';
            //@ts-ignore
            this.formRef.current.elements.durationAddEnd.value = '';
        }

        
        ev.preventDefault();
    }

    edit() {
        let i = 0;
        const durations = this.state.cookingDuration.map((el)=>{
            let bindedFn = this.deleteOneInterval.bind(this, el);
            const dur = `${el.start} - ${el.end} секунд`;
            return (<li className='list-group-item filter__interval-row' key={i++}><span id={`period-of-time-${i}`}>{dur}</span><button 
                    aria-controls={`period-of-time-${i}`}
                    aria-label={`удалить промежуток варки ${dur}`}
                    type="button" 
                    className="btn btn-outline-default waves-effect btn-sm filter__button_right"
                    onClick={bindedFn}>Удалить</button>
                </li>);
        });
        return (
            <form ref={this.formRef} className='card filter' aria-live='polite'>
                <header className='card-header'>
                    <h3>Настройка интервалов</h3>
                </header>
                <div className='card-body'>
                    <fieldset aria-label='установленные промежутки варки'>
                        <ul className='list-group list-group-flush'>
                            {durations}
                        </ul>
                        <fieldset className={'list-group-item' + (this.state.validation.cookingDuration ? ' filter__group_error' : '')}
                            aria-label='добавить новый интервал варки кофе'>
                            <div className='filter__interval'>
                                <legend>+ интервал</legend>
                                <div className='md-form'>
                                    <input type="number" id="durationAddStart" className="form-control" />
                                    <label htmlFor="durationAddStart" className='active'>время от</label>
                                </div>
                                <div className='md-form'>
                                    <input type="number" id="durationAddEnd" className="form-control" />
                                    <label htmlFor="durationAddEnd" className='active'>время до</label>
                                </div>
                                <button type="button" className="btn btn-light btn-sm" 
                                    aria-label="добавить интервал в статистику"
                                    onClick={this.addCookingDuration}>добавить</button>
                                
                            </div>
                            {
                                this.state.validation.cookingDuration ? 
                                <div className="alert alert-danger" role="alert">{this.state.validation.cookingDuration}</div> : ''
                            }
                        </fieldset>
                    </fieldset>
                </div>
                <footer className='card-footer'>
                    <button type="button" className="btn btn-primary" onClick={this.saveFilter}>Сохранить</button>
                    <button type="button" className="btn btn-light" onClick={this.cancel}>Отмена</button>
                </footer>
            </form>
        )
    }

    render() {
        return  (
            <React.Fragment>
                { this.current() }
                { this.state.editMode ? this.edit() : ''}
            </React.Fragment>
        );
    }
  
    componentDidUpdate(prevProps: IFilterProps, prevState:IFilterState) {
        if (this.state.editMode && !prevState.editMode)
            this.formRef.current.focus();
    }
};