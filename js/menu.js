const {Menu} = require('electron');

let mainWindow;

const template = [
    {
        label:"窗口",
        role: 'window',
        submenu: [
            {
                label:"重新加载",
                role: 'reload'
            },
            {
                label:"最小化",
                role: 'minimize'
            },
            {
                label:"关闭",
                role: 'close'
            }
        ]
    }
];


module.exports = function(win) {
    mainWindow = win;
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};
