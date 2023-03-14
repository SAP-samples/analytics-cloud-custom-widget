(function() {
    let _shadowRoot;
    let _id;
    let _password;
    let _date;

    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
      <style>
      </style>
      <div id="ui5_content" name="ui5_content">
         <slot name="content"></slot>
      </div>
        <script id="myXmlView" name="oView" type="ui5/xmlview">
            <mvc:View
                controllerName="MyController"
                xmlns="sap.m"
                xmlns:core="sap.ui.core"
                xmlns:mvc="sap.ui.core.mvc"
                xmlns:fd="fd.ui"> 
                <!-- use our custom control, see below -->
                <fd:Headline id="botchat" 
                                        title="Chat"
                                        height="600px"
                                        width="350px"
                                        showCloseButton="true"
                                        send="onSendPressed"
                                        initialMessage="hello wha dup?"
                                        placeHolder="Chat with me"
                                        userIcon="https://cdn.recast.ai/webchat/user.png"
                                        robotIcon="https://cdn.recast.ai/webchat/bot.png"
                                        buttonIcon="sap-icon://discussion">                                        
                    </fd:Headline>                   
            </mvc:View>
        </script>     
    `;

    class Card extends HTMLElement {

        constructor() {
            super();

            _shadowRoot = this.attachShadow({
                mode: "open"
            });
            _shadowRoot.appendChild(tmpl.content.cloneNode(true));

            _id = createGuid();

            //_shadowRoot.querySelector("#oView").id = _id + "_oView";

            this._export_settings = {};
            this._export_settings.password = "";

            this.settings = {};
            this.settings.format = "Ferry";

            this.addEventListener("click", event => {
                console.log('click');
                this.dispatchEvent(new CustomEvent("onStart", {
                    detail: {
                        settings: this.settings
                    }
                }));
            });

            this._firstConnection = 0;
        }

        connectedCallback() {
            try {
                if (window.commonApp) {
                    let outlineContainer = commonApp.getShell().findElements(true, ele => ele.hasStyleClass && ele.hasStyleClass("sapAppBuildingOutline"))[0]; // sId: "__container0"

                    if (outlineContainer && outlineContainer.getReactProps) {
                        let parseReactState = state => {
                            let components = {};

                            let globalState = state.globalState;
                            let instances = globalState.instances;
                            let app = instances.app["[{\"app\":\"MAIN_APPLICATION\"}]"];
                            let names = app.names;

                            for (let key in names) {
                                let name = names[key];

                                let obj = JSON.parse(key).pop();
                                let type = Object.keys(obj)[0];
                                let id = obj[type];

                                components[id] = {
                                    type: type,
                                    name: name
                                };
                            }

                            for (let componentId in components) {
                                let component = components[componentId];
                            }

                            let metadata = JSON.stringify({
                                components: components,
                                vars: app.globalVars
                            });

                            if (metadata != this.metadata) {
                                this.metadata = metadata;

                                this.dispatchEvent(new CustomEvent("propertiesChanged", {
                                    detail: {
                                        properties: {
                                            metadata: metadata
                                        }
                                    }
                                }));
                            }
                        };

                        let subscribeReactStore = store => {
                            this._subscription = store.subscribe({
                                effect: state => {
                                    parseReactState(state);
                                    return {
                                        result: 1
                                    };
                                }
                            });
                        };

                        let props = outlineContainer.getReactProps();
                        if (props) {
                            subscribeReactStore(props.store);
                        } else {
                            let oldRenderReactComponent = outlineContainer.renderReactComponent;
                            outlineContainer.renderReactComponent = e => {
                                let props = outlineContainer.getReactProps();
                                subscribeReactStore(props.store);

                                oldRenderReactComponent.call(outlineContainer, e);
                            }
                        }
                    }
                }
            } catch (e) {}
        }

        disconnectedCallback() {
            if (this._subscription) { // react store subscription
                this._subscription();
                this._subscription = null;
            }
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            if ("designMode" in changedProperties) {
                this._designMode = changedProperties["designMode"];
            }
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            var that = this;
            loadthis(that);
        }

        _renderExportButton() {
            let components = this.metadata ? JSON.parse(this.metadata)["components"] : {};
            console.log("_renderExportButton-components");
            console.log(components);
            console.log("end");
        }

        _firePropertiesChanged() {
            this.password = "";
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        password: this.password
                    }
                }
            }));
        }

        // SETTINGS
        get password() {
            return this._export_settings.password;
        }
        set password(value) {
            this._export_settings.password = value;
        }

        get date() {
            return this._export_settings.date;
        }

        set date(value) {
            value = _date;
            this._export_settings.date = value;
        }

        static get observedAttributes() {
            return [
                "password"
            ];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue != newValue) {
                this[name] = newValue;
            }
        }

    }
    customElements.define("com-fd-djaja-sap-sac-card", Card);

    // UTILS
    function loadthis(that) {
        var that_ = that;


        let content = document.createElement('div');
        content.slot = "content";
        that_.appendChild(content);
        that_._renderExportButton();

        sap.ui.getCore().attachInit(function() {
            "use strict";

            //### Custom Control ###
            // remove the first parameter in "real" apps
            sap.ui.define("fd/ui/Headline", [
                "sap/ui/core/Control",
                "sap/m/Button",
                "sap/ui/core/IconPool",
                "sap/m/Dialog",
                "sap/m/List",
                "sap/m/FeedListItem",
                "sap/m/FeedInput",
                "sap/m/ResponsivePopover",
                "sap/m/VBox",
                "sap/m/ScrollContainer",
                "sap/m/Bar",
                "sap/m/Title",
                "sap/ui/core/ResizeHandler"
            ], function(Control, Button, IconPool, Dialog, List, FeedListItem, FeedInput, ResponsivePopover, VBox, ScrollContainer, Bar, Title, ResizeHandler) {
                "use strict";

                var ChatDialog = Control.extend("fd.ui.Headline", {
                    metadata: {
                        properties: {
                            title: {
                                type: "string",
                                group: "Appearance",
                                defaultValue: null
                            },
                            width: {
                                type: "sap.ui.core.CSSSize",
                                group: "Dimension",
                                defaultValue: null
                            },
                            height: {
                                type: "sap.ui.core.CSSSize",
                                group: "Dimension",
                                defaultValue: null
                            },

                            buttonIcon: {
                                type: "sap.ui.core.URI",
                                group: "Appearance",
                                defaultValue: null
                            },
                            robotIcon: {
                                type: "sap.ui.core.URI",
                                group: "Appearance",
                                defaultValue: null
                            },
                            userIcon: {
                                type: "sap.ui.core.URI",
                                group: "Appearance",
                                defaultValue: null
                            },

                            initialMessage: {
                                type: "string",
                                group: "Appearance",
                                defaultValue: "Hello, How can I help?"
                            },
                            placeHolder: {
                                type: "string",
                                group: "Appearance",
                                defaultValue: "Post something here"
                            }
                        },
                        aggregations: {
                            _chatButton: {
                                type: "sap.m.Button",
                                multiple: false
                            },
                            _popover: {
                                type: "sap.m.ResponsivePopover",
                                multiple: false
                            }
                        },
                        events: {
                            send: {
                                parameters: {
                                    text: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    },

                    init: function() {
                        //initialisation code, in this case, ensure css is imported
                        var libraryPath = jQuery.sap.getModulePath("pfe.bot");
                        jQuery.sap.includeStyleSheet(libraryPath + "/css/bkChat.css");


                        var oBtn = new Button(this.getId() + "-bkChatButton", {
                            press: this._onOpenChat.bind(this)
                        });
                        this.setAggregation("_chatButton", oBtn);

                        var oHeader = new Bar({
                            contentLeft: new Button({
                                icon: "sap-icon://sys-cancel",
                                press: this._toggleClose.bind(this),
                                tooltip: "Clear chat"
                            }),
                            contentMiddle: new Title(this.getId() + "-bkChatTitle", {}),
                            contentRight: new Button({
                                icon: "sap-icon://pushpin-off",
                                press: this._toggleAutoClose.bind(this),
                                tooltip: "Toggle"
                            })
                        });

                        var oRpop = new ResponsivePopover(this.getId() + "-bkChatPop", {
                            customHeader: oHeader,
                            placement: "Top",
                            showHeader: true,
                            resizable: true,
                            horizontalScrolling: false,
                            verticalScrolling: false,
                            beforeClose: function(e) {
                                ResizeHandler.deregister(this.sResizeHandleId);
                            }.bind(this),
                            afterOpen: function(e) {
                                this.sResizeHandleId = ResizeHandler.register(sap.ui.getCore().byId(this.getId() + "-bkChatPop"), this._saveDimensions.bind(this));
                            }.bind(this),
                        }).addStyleClass("sapUiTinyMargin");


                        this.setAggregation("_popover", oRpop);

                        var oFeedIn = new FeedInput(this.getId() + "-bkChatInput", {
                            post: this._onPost.bind(this),
                            showIcon: true
                        });

                        oFeedIn.addEventDelegate({
                            onsapenter: function(oEvent) {
                                oEvent.preventDefault();
                                var sTxt = oFeedIn.getValue();
                                if (sTxt.length > 0) {
                                    oFeedIn.fireEvent("post", {
                                        value: sTxt
                                    }, true, false);
                                    oFeedIn.setValue(null);
                                }
                            }
                        });

                        var oFeedList = new List(this.getId() + "-bkChatList", {
                            showSeparators: "None",
                            showNoData: false
                        });

                        var oInitialFeedListItem = new FeedListItem(this.getId() + "-bkChatInitial", {
                            showIcon: true,
                            text: "Hello I'm SAC Bot, how can i help you?"
                        });
                        oInitialFeedListItem.addStyleClass("bkRobotInput");
                        oFeedList.addItem(oInitialFeedListItem);


                        var oScroll = new ScrollContainer(this.getId() + "-bkChatScroll", {
                            horizontal: false,
                            vertical: true,
                            focusable: true
                        });
                        oScroll.insertContent(oFeedList);


                        var oStatusBar = new sap.m.Label(this.getId() + "-bkChatStatusBar", {
                            text: ""
                        }).addStyleClass("sapUiTinyMargin");

                        var oVBox = new VBox({
                            items: [oScroll, oStatusBar, oFeedIn],
                            fitContainer: true,
                            justifyContent: "End",
                            alignItems: "Stretch"
                        });

                        oRpop.insertContent(oVBox, 0);
                    },

                    renderer: function(oRm, oControl) {
                        var oChatBtn = oControl.getAggregation("_chatButton");
                        var oPop = oControl.getAggregation("_popover");

                        oRm.write("<div ");
                        //oRm.addClass("bkChatButton");
                        //oRm.writeClasses();
                        oRm.write(">");

                        oRm.renderControl(oChatBtn);
                        oRm.renderControl(oPop);
                        oRm.write("</div>");
                    },

                    onAfterRendering: function(args) {
                        if (sap.ui.core.Control.prototype.onAfterRendering) {
                            sap.ui.core.Control.prototype.onAfterRendering.apply(this, args);
                        }
                    },

                    setTitle: function(sTitle) {
                        this.setProperty("title", sTitle, true);
                        sap.ui.getCore().byId(this.getId() + "-bkChatTitle").setText(sTitle);
                    },

                    setHeight: function(sHeight) {
                        this.setProperty("height", sHeight, true);
                        sap.ui.getCore().byId(this.getId() + "-bkChatPop").setContentHeight(sHeight);

                        var iScrollHeight = sHeight.substring(0, sHeight.length - 2) - "96px".substring(0, "96px".length - 2);
                        sap.ui.getCore().byId(this.getId() + "-bkChatScroll").setHeight(iScrollHeight + "px");
                    },

                    setWidth: function(sWidth) {
                        this.setProperty("width", sWidth, true);
                        sap.ui.getCore().byId(this.getId() + "-bkChatPop").setContentWidth(sWidth);
                    },

                    setUserIcon: function(sUserIcon) {
                        this.setProperty("userIcon", sUserIcon, true);
                        sap.ui.getCore().byId(this.getId() + "-bkChatInput").setIcon(sUserIcon);
                    },

                    setRobotIcon: function(sRobotIcon) {
                        this.setProperty("robotIcon", sRobotIcon, true);
                        sap.ui.getCore().byId(this.getId() + "-bkChatInitial").setIcon(sRobotIcon);
                    },

                    setButtonIcon: function(sButtonIcon) {
                        this.setProperty("buttonIcon", sButtonIcon, true);
                        sap.ui.getCore().byId(this.getId() + "-bkChatButton").setIcon(sButtonIcon);
                    },

                    setInitialMessage: function(sText) {
                        this.setProperty("initialMessage", sText, true);
                        sap.ui.getCore().byId(this.getId() + "-bkChatInitial").setText(sText);
                    },

                    setPlaceHolder: function(sText) {
                        this.setProperty("placeHolder", sText, true);
                        sap.ui.getCore().byId(this.getId() + "-bkChatInput").setPlaceholder(sText);
                    },

                    _onPost: function(oEvent) {
                        var this_ = this;
                        setTimeout(function() {
                            this_.botStartTyping();
                        }, 1000);

                        var sText = oEvent.getSource().getValue();
                        this.addChatItem(sText, true);
                        this.fireEvent("send", {
                            text: sText
                        }, false, true);
                    },

                    _onOpenChat: function(oEvent) {
                        this.getAggregation("_popover").openBy(this.getAggregation("_chatButton"));
                        this.getAggregation("_popover").setContentHeight(this.getProperty("height"));
                        this.getAggregation("_popover").setContentWidth(this.getProperty("width"));
                    },

                    _saveDimensions: function(oEvent) {
                        //console.log(sap.ui.getCore().byId(this.getId() + "-bkChatPop").getContentHeight() + ", " + oEvent.size.height);
                        this.setProperty("height", oEvent.size.height + "px", true);
                        this.setProperty("width", oEvent.size.width + "px", true);
                    },

                    _toggleAutoClose: function(oEvent) {
                        var bAuto = this.getAggregation("_popover").getAggregation("_popup").oPopup.getAutoClose();
                        if (bAuto) {
                            oEvent.getSource().setProperty("icon", "sap-icon://pushpin-on");
                            this.getAggregation("_popover").getAggregation("_popup").oPopup.setAutoClose(false);
                        } else {
                            oEvent.getSource().setProperty("icon", "sap-icon://pushpin-off");
                            this.getAggregation("_popover").getAggregation("_popup").oPopup.setAutoClose(true);
                        }
                    },

                    _toggleClose: function() {
                        sap.ui.getCore().byId(this.getId() + "-bkChatList").removeAllItems();
                        this.getAggregation("_popover").close();
                    },

                    botStartTyping: function() {
                        sap.ui.getCore().byId(this.getId() + "-bkChatStatusBar").setText("Bot is typing...");
                    },

                    botFinishTyping: function() {
                        sap.ui.getCore().byId(this.getId() + "-bkChatStatusBar").setText("");
                    },

                    addChatItem: function(sText, bUser) {
                        var oFeedListItem = new FeedListItem({
                            showIcon: true,
                            text: sText
                        });

                        if (bUser) {
                            oFeedListItem.setIcon(this.getUserIcon());
                            oFeedListItem.addStyleClass("bkUserInput");
                            sap.ui.getCore().byId(this.getId() + "-bkChatList").addItem(oFeedListItem, 0);
                        } else {
                            oFeedListItem.setIcon(this.getRobotIcon());
                            oFeedListItem.addStyleClass("bkRobotInput");
                            sap.ui.getCore().byId(this.getId() + "-bkChatList").addItem(oFeedListItem, 0);

                        }
                        var oScroll = sap.ui.getCore().byId(this.getId() + "-bkChatScroll");
                        setTimeout(function() {
                            oScroll.scrollTo(0, 1000, 0);
                        }, 0);
                    }
                });

                return ChatDialog;
            });

            //### Controller ###
            sap.ui.define([
                "sap/ui/core/mvc/Controller"
            ], function(Controller, ODataModel) {
                "use strict";

                return Controller.extend("MyController", {
                    onSendPressed: function(oEvent) {
                        var chatbot = this.getView().byId("botchat");
                        var question = oEvent.getParameter("text");
                        console.log(question);
                        var data = '{"message": {"content":"' + question + '","type":"text"}, "conversation_id": "CONVERSATION_ID"}';

                        var _id = localStorage.getItem("chatId");
                        if (_id != undefined) {
                            //payload.id = _id;
                        }

                        jQuery.ajax({
                            url: "REPLACE_WITH_SAP_CAI_ENDPOINT",
                            cache: false,
                            type: "POST",
                            headers: {
                                'Authorization': 'User xxxx',
                                'Content-Type': 'application/json'
                            },
                            data: data,
                            async: true,
                            success: function(sData) {
                                console.log('[POST] /discover-dialog', sData);

                                chatbot.addChatItem(sData.results.messages[0].content, false);
                                chatbot.botFinishTyping();
                                localStorage.setItem("chatId", sData.id);
                            },
                            error: function(sError) {
                                chatbot.addChatItem("Something error!", false);
                            }
                        });
                    }
                });
            });

            //### THE APP: place the XMLView somewhere into DOM ###
            var oView = sap.ui.xmlview({
                viewContent: jQuery(_shadowRoot.getElementById("myXmlView")).html(),
            });

            oView.placeAt(content);
        });
    }

    function handleEvent(sKey, sEventType) {
        var sMessage = sEventType + " fired!";
        switch (sKey) {
            case "suppress":
                console.log(sMessage);
                break;
            case "alert":
                alert(sMessage);
                break;
            default:
                console.log("Unknown key: " + sKey);
        }
    }

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0,
                v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function loadScript(src, shadowRoot) {
        return new Promise(function(resolve, reject) {
            let script = document.createElement('script');
            script.src = src;

            script.onload = () => {
                console.log("Load: " + src);
                resolve(script);
            }
            script.onerror = () => reject(new Error(`Script load error for ${src}`));

            shadowRoot.appendChild(script)
        });
    }
})();
