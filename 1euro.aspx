<%@ Page Title="" Language="C#" MasterPageFile="~/masterpages/CTeasy.master" AutoEventWireup="true" CodeFile="1euro.aspx.cs" Inherits="_1euro" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolderSEO" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="BodyContent" runat="Server">
    
    <section class="content">
        <div class="container">
            <div class="row">
                <div class="breadcrumb"><a href="/">Accueil</a> <span style="color: #333">></span> <a href="#" class="active">1 &euro; : les chanceux </a></div>
                <h1 class="title"><span>Nos heureux clients à 1€ depuis le début <%= DateTime.Now.Year %>!</span></h1>
                <div class="message1euro">
                    <p>EMPLACEMENT POUR TEXTE DE CARINE</p>
                </div>
            </div>
            <div class="row" style="overflow:hidden">
                <div class="embed-responsive embed-responsive-16by9" style="overflow:hidden">
                    <iframe class="embed-responsive-item" src="1eurofrm.aspx" style="overflow:hidden"></iframe>
                </div>
            </div>
        </div>
    </section>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="PageSpecificScript" runat="Server">
</asp:Content>

