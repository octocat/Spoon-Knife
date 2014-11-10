#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <iostream>
#include <fstream>
#include <QMessageBox>
#include <QTextEdit>

bool checked;
MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::on_pushButton_clicked()
{

    QMessageBox msgBox;

    if(ui->checkBox->isChecked()){
        std::ofstream myFile;
        QString textEditText = ui->textEdit->toPlainText();
        myFile.open("output.md");
        myFile << textEditText.toStdString();
        msgBox.setText("File saved as output.md.");
        msgBox.exec();
        myFile.close();
    }

    else{
        std::ofstream myFile;
        QString textEditText = ui->textEdit->toPlainText();
        myFile.open("output.txt");
        myFile << textEditText.toStdString();
        msgBox.setText("File saved as output.txt.");
        msgBox.exec();
        myFile.close();
    }

}
