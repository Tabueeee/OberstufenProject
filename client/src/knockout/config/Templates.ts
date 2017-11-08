const templates = {
    // room: require('..\\..\\content\\components\\room\\room.html'),
    // issueForm: require('..\\..\\content\\components\\issueForm\\issueForm.html'),
    sidebar: require('..\\..\\content\\components\\sidebar\\sidebar.html'),
    home: require('..\\..\\content\\components\\home\\home.html'),
    roomGroups: require('..\\..\\content\\components\\roomGroups\\roomGroups.html'),
    roomGroupsAngled: require('..\\..\\content\\components\\roomGroupsAngled\\roomGroupsAngled.html'),
    roomCircular: require('..\\..\\content\\components\\roomCircular\\roomCircular.html')
};

export class TemplateSupplier {
    public getTemplate(templateName: string) {
        let template = templates[templateName];
        if (typeof template !== 'undefined') {
            return template;
        }

        throw new Error('referenced template not found for: ' + templateName);
    }
}
