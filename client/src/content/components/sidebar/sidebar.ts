import {Component} from '../Component';

export class Sidebar extends Component {

    private static readonly COMPONENT_NAME = 'sidebar';
    public rooms: Array<any>;
    public wingList = [];

    public constructor(rooms: any) {
        super(Sidebar.COMPONENT_NAME);
        this.rooms = rooms;
        this.wingList = this.getUniqueKeys(rooms, 'wing').sort(function (a, b) {
            if (a < b) {
                return -1;
            }

            if (a > b) {
                return 1;
            }

            return 0;
        });
    }


    public getFloorListForWing(wing: string) {
        let wingRooms = this.rooms.filter((room) => room.wing === wing);
        return this.getUniqueKeys(wingRooms, 'floor');
    }

    public getRooms(wing, floor) {

        let filteredRooms = this.rooms.filter((room) => room.wing === wing && room.floor === floor);
        return filteredRooms.sort(function (a, b) {
            if (a.substr(1) < b.substr(1)) {
                return -1;
            }

            if (a.substr(1) > b.substr(1)) {
                return 1;
            }

            return 0;
        });

        // return this.rooms.filter((room) => room.wing === wing && room.floor === floor);
    }

    public getRoomsByWing(wing) {
        let filteredRooms = this.rooms.filter((room) => room.wing === wing);
        return filteredRooms.sort(function (a, b) {
            if (a.roomId < b.roomId) {
                return -1;
            }

            if (a.roomId > b.roomId) {
                return 1;
            }

            return 0;
        });
    }

    public onLoad() {
        console.log('loading sidebar');
    }

    public updateViewModel(viewModel: any) {
        throw new Error('Method not implemented.');
    }

    private getUniqueKeys(arr, property) {
        let u = {}, a = [];
        for (let i = 0, l = arr.length; i < l; ++i) {
            if (!u.hasOwnProperty(arr[i][property])) {
                a.push(arr[i][property]);
                u[arr[i][property]] = 1;
            }
        }

        return a;
    }
}
