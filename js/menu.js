const {Menu} = require('electron');

let mainWindow;

const template = [
    {label: 'Edit',
        submenu: [
            {
                role: 'undo'
            },
            {
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                role: 'cut'
            },
            {
                role: 'copy'
            },
            {
                role: 'paste'
            },
            {
                role: 'pasteandmatchstyle'
            },
            {
                role: 'delete'
            },
            {
                role: 'selectall'
            }
        ]
    },
    {
        label:"窗口",
        role: 'window',
        submenu: [
            {
                label:"开发者工具",
                role: 'toggledevtools'
            },
            {
                type: 'separator'
            },
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
