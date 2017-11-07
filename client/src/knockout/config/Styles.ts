const styles = {
    // room: require('..\\..\\content\\components\\room\\room.css'),
    // issueForm: require('..\\..\\content\\components\\issueForm\\issueForm.css'),
    sidebar: require('..\\..\\content\\components\\sidebar\\sidebar.css'),
    home: require('..\\..\\content\\components\\home\\home.css')
};

export class StylesSupplier {
    public getStyles(styleName: string) {
        let style = styles[styleName];
        if (typeof style !== 'undefined') {
            return style;
        }

        throw new Error('referenced Styles not found for: "' + styleName + '"');
    }
}
