export const componentClassMapping = {
    home: 'Home',
    sidebar: 'Sidebar',
    roomGroups: 'RoomGroups',
    roomCircular: 'RoomCircular',
    roomGroupsAngled: 'RoomGroupsAngled'
};

export type ComponentName = keyof typeof componentClassMapping;

export function isComponentName(x: string): x is ComponentName {
    for (let component in componentClassMapping) {
        if (x === component) {
            return true;
        }
    }

    return false;
}
