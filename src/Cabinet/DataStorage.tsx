interface IMenuItem {
    title: string,
    path: string,
    key: string
}

interface IShortMachineItem {
    id: number,
    address: string,
    status: boolean,
    countCup: number,
    turnOnDateTime: string,
    errors?: string[]
}

interface IShortMachineFilter {
    address?: string,
    status?: boolean
}


interface IMachineInfo {
    id: number,
    address: string,
    status: boolean,
    countCup: number,
    turnOnDateTime: string,
    errors?: string[]
}

const MashinesInfo:{[propertyname:number]:IMachineInfo} = {
    0: {
        id: 0,
        address: 'г. Москва, ул. Арбат, д. 1',
        status: true,
        countCup: 10,
        turnOnDateTime: '2 апр 2019, 7:50',
        errors: ['Машина не промывалась более двух суток']
    }
}

const dataMenu:{[propertyname:string]:IMenuItem[]} = {
    main: [ 
        {
            title: 'Ваши кофе-машины',
            path: '/main/list',
            key:'main'
        }, 
        {
            title: 'Обращения',
            path: '/main/appeal',
            key: 'appeal'
        } 
    ],

    detail: [ 
        {
            title: 'К списку',
            path: '/main/list',
            key:'det1'
        },
        {
            title: 'Статистика',
            path: '/detail/:id/stat',
            key: 'det2'
        }, 
        {
            title: 'Настройки',
            path: '/detail/:id/settings',
            key: 'det3'
        }, 
        {
            title: 'История ошибок',
            path: '/detail/:id/errors',
            key: 'det4'
        }, 
        {
            title: 'Обращения',
            path: '/detail/:id/appeal',
            key: 'det5'
        }, 
        {
            title: 'Управлять',
            path: '/detail/:id/manage',
            key: 'det6'
        }
    ]
}

const listMachines:IShortMachineItem[] = [
    {
        id: 0,
        address: 'г. Москва, ул. Арбат, д. 1',
        status: true,
        countCup: 10,
        turnOnDateTime: '2 апр 2019, 7:50',
        errors: ['Машина не промывалась более двух суток']
    }
]

interface IInterval {
    start: number,
    end: number
}

interface IFilterStat {
    periodStart: Date,
    periodEnd: Date,
    intervals: IInterval[],
    groupBy: number //count Hours
}

interface IDataList {
    filter: IFilterStat,
    data: IStatList
}

interface ISerie {
    data: number[],
    legend: string
}

interface IStatList {
    series: ISerie[],
    minValue: number,
    maxValue: number,
    xAxis: string[]
}

const StatsData:{[propertyname:number]:IDataList} = {
    0: {
        data: {
            series: [
                {
                    legend: 'от 14 до 19',
                    data: [0, 0, 5, 9, 12, 10, 3, 5, 6, 9, 1, 3]
                },
                {
                    legend: 'от 19 до 30',
                    data: [0, 3, 10, 16, 22, 17, 10, 12, 15, 24, 9, 2]
                }
            ],
            minValue: 0,
            maxValue: 25,
            xAxis: [ '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00',
                     '14:00', '15:00', '16:00', '17:00', '18:00']
        },
        filter: {
            periodStart: new Date('2019-03-15'),
            periodEnd: new Date('2019-04-15'),
            intervals: [{
                    start: 14,
                    end: 19
                }, {
                    start: 19,
                    end: 30
                }
            ],
            groupBy: 24
        }
    }
}

const DataStorage = {
    getMenu(currentPath:string):Promise<IMenuItem[]> {
        return new Promise((resolve) => {
            resolve(dataMenu[currentPath]);
        });
    },

    getMashineList(filter:IShortMachineFilter):Promise<IShortMachineItem[]> {
        return new Promise((resolve) => {
            setTimeout(()=>{
                resolve(listMachines);
            }, 500 + Math.random() * 1000);
        });
    },

    getInfoById(id:number):Promise<IMachineInfo> {
        return new Promise((resolve) => {
            setTimeout(()=>{
                resolve(MashinesInfo[id]);
            }, 500 + Math.random() * 1000);
        });
    },

    getStats(id:number, filter:IFilterStat):Promise<IDataList> {
        return new Promise((resolve) => {
            setTimeout(()=>{
                if (filter) {
                    StatsData[id].filter = filter;
                }
                resolve(StatsData[id]);
            }, 500 + Math.random() * 1000);
        })
    }
}

export {IMenuItem,
    IShortMachineItem,
    IMachineInfo,
    IStatList,
    IDataList,
    IInterval,
    IFilterStat,
    DataStorage};