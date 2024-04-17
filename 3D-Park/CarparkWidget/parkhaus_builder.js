(function()  {
	let template = document.createElement("template");
	template.innerHTML = `
		<style>
		:host {
			display: block;
			padding: 1em 1em 1em 1em;
		}
		</style>
	`;

	class testwidgetBuilderPanel extends HTMLElement {
		constructor() {
			super();
			var that = this;
			//this._shadowRoot = this.attachShadow({mode: "open"});
			//this._shadowRoot.appendChild(template.content.cloneNode(true));
			var div = /* $('<div></div>'); // */document.createElement("div");
			this.appendChild(div/* [0] */);
			//this._shadowRoot.appendChild(div[0]);
			sap.ui.require(['sap/m/MessageToast','sap/ui/core/mvc/Controller', 'sap/ui/core/mvc/XMLView', 'sap/ui/model/json/JSONModel', 'sap/m/Dialog', 'sap/m/Button', 'sap/m/library', 'sap/m/Text'],
				function(MessageToast, Controller, XMLView, JSONModel, Dialog, Button, mobileLibrary, Text) {
				"use strict";

				var PageController = Controller.extend("PageController", {
					onInit: function() {
						this.getView().setModel(new JSONModel("https://sap-samples.github.io/analytics-cloud-custom-widget/3D-Park/CarparkWidget/State.json"));
						this.getView().setModel(new JSONModel("https://sap-samples.github.io/analytics-cloud-custom-widget/3D-Park/CarparkWidget/types.json"), "A");
					},
					// onPress: function (evt) {
					// 	// MessageToast.show(evt.getSource().getBindingContext().getProperty("Name")
					// 	// + " Pressed");
					// 	// var prop = evt.getSource().getModel().getProperty("/ProductCollection")
					// 	// evt.getSource().getModel().setProperty("/ProductCollection", prop.slice(0, prop.length - 1).concat({ ProductId: "Hello World", Name: "Bye bye" }).concat(prop.slice(prop.length - 1, prop.length)));
					// 	var src = evt.getSource();
					// 	src.getBindingContext().setProperty()
					// 	// var collist = src.getParent();
					// 	// var j = collist.indexOfItem(src);
					// 	// var rowlist = collist.getParent();
					// 	// var i = rowlist.indexOfItem(src);

					// },
					onAddFloor: function(e) {
						var model = e.getSource().getModel();
						var source = model.getProperty("/ProductCollection");
						var rlength = source.length > 0 ? source[0].ProductCollection.length : 0;
						var dest = source.concat({ ProductId: "floor" + source.length, Name: source.length, ProductCollection: function() {
							var row = [];
							for(var j = 0; j < rlength; ++j) {
								row.push({ ProductId: "column" + j, Name: "Row" + source.length, selectedkeys: []});
							}
							return row;
						}()});
						model.setProperty("/ProductCollection", dest);
					},
					onAddCell: function(e) {
						var model = e.getSource().getModel();
						var source = model.getProperty("/ProductCollection");
						for(var i = 0; i < source.length; ++i) {
							source[i].ProductCollection = source[i].ProductCollection.concat({ ProductId: "column" + source[i].ProductCollection.length, Name: "Row" + source.length, selectedkeys: []});
						}
						model.setProperty("/ProductCollection", source);
					},
					onRemoveRow: function(e) {
						var src = e.getSource();
						var model = src.getModel();
						var oDialog = new Dialog({
							title: 'Warning',
							type: 'Message',
							state: 'Warning',
							content: new Text({
								text: 'This will remove the complete Row'
							}),
							buttons: [new Button({
								type: mobileLibrary.ButtonType.Emphasized,
								text: 'OK',
								press: function () {
									var item = src.getParent().getParent().getParent();
									var list = item.getParent();
									var i = list.indexOfItem(item);
									var source = model.getProperty("/ProductCollection");
									source = source.slice(0, i).concat(source.slice(i + 1, source.length));
									model.setProperty("/ProductCollection", source);
									oDialog.close();
								}
							}),new Button({
								type: mobileLibrary.ButtonType.Emphasized,
								text: 'CANCEL',
								press: function () {
									oDialog.close();
								}
							})],
							afterClose: function () {
								oDialog.destroy();
							}
						});

						oDialog.open();
					},
					onRemoveCell: function(e) {
						var src = e.getSource();
						var model = src.getModel();
						var oDialog = new Dialog({
							title: 'Warning',
							type: 'Message',
							state: 'Warning',
							content: new Text({
								text: 'Ruling the world is a time-consuming task. You will not have a lot of spare time.'
							}),
							buttons: [new Button({
								type: mobileLibrary.ButtonType.Emphasized,
								text: 'OK',
								press: function () {
									var item = src.getParent();
									var list = item.getParent();
									var j = list.indexOfItem(item);
									var source = model.getProperty("/ProductCollection");
									for(var i = 0; i < source.length; ++i) {
										source[i].ProductCollection = source[i].ProductCollection.slice(0, j).concat(source[i].ProductCollection.slice(j + 1, source[i].ProductCollection.length));
									}
									model.setProperty("/ProductCollection", source);
									oDialog.close();
								}
							}),new Button({
								type: mobileLibrary.ButtonType.Emphasized,
								text: 'CANCEL',
								press: function () {
									oDialog.close();
								}
							})],
							afterClose: function () {
								oDialog.destroy();
							}
						});

						oDialog.open();
					},
					treeTableDragStart: function(oEvent) {
						this.showDragStartEventInfo(oEvent, "TreeTable");
					},

					treeTableReorderDragEnter: function(oEvent) {
						this.showDragEnterEventInfo(oEvent, "TreeTable Reorder");
					},

					treeTableReorderDrop: function(oEvent) {
						this.showDropEventInfo(oEvent, "TreeTable Reorder");
					},
					showDragStartEventInfo: function(oEvent, sTitle) {
						sap.m.MessageToast.show(
							sTitle + " (" + "DragStart parameters" + ")"
							+ "\nDrag target: " + oEvent.getParameter("target").getId()
							+ "\nDrag session: " + (oEvent.getParameter("dragSession") ? "available" : "not available")
							+ "\nBrowser event: " + oEvent.getParameter("browserEvent").type,
							{
								width: "25rem"
							}
						);
					},

					showDragEnterEventInfo: function(oEvent, sTitle) {
						sap.m.MessageToast.show(
							sTitle + " (" + "DragEnter parameters" + ")"
							+ "\nDrop target: " + oEvent.getParameter("target").getId()
							+ "\nDrag session: " + (oEvent.getParameter("dragSession") ? "available" : "not available")
							+ "\nBrowser event: " + oEvent.getParameter("browserEvent").type,
							{
								width: "25rem"
							}
						);
					},

					showDropEventInfo: function(oEvent, sTitle) {
						sap.m.MessageToast.show(
							sTitle + " (" + "Drop parameters" + ")"
							+ "\nDragged control: " + oEvent.getParameter("draggedControl").getId()
							+ "\nDropped control: " + oEvent.getParameter("droppedControl").getId()
							+ "\nDrop position: " + oEvent.getParameter("dropPosition")
							+ "\nDrag session: " + (oEvent.getParameter("dragSession") ? "available" : "not available")
							+ "\nBrowser event: " + oEvent.getParameter("browserEvent").type,
							{
								duration: 8000,
								width: "25rem"
							}
						);
						var oSelectedItem = oEvent.getParameter("draggedControl");
						var list = oSelectedItem.getParent();
						var dropPosition = oEvent.getParameter("dropPosition");
						if(dropPosition != "On") {
							var oCurrentIndex = list.indexOfItem(oEvent.getParameter("droppedControl")) + (dropPosition != "Before" ? 1 : -1);
							list.removeItem(oSelectedItem);
							list.insertItem(oSelectedItem, oCurrentIndex);
						} else {
							var droppedControl = oEvent.getParameter("droppedControl");
							var i = list.indexOfItem(oSelectedItem);
							var j = list.indexOfItem(droppedControl);
							if(i > j) {
								var tmpi = i;
								var tmpitem = oSelectedItem;
								i = j;
								j = tmpi;
								oSelectedItem = droppedControl;
								droppedControl = tmpitem;
							}
							list.removeItem(oSelectedItem);
							list.removeItem(droppedControl);
							list.insertItem(droppedControl, i);
							list.insertItem(oSelectedItem, j);
						}
					},
					onApply: function() {
						that._submit();
					}
				});

				XMLView.create({ controller: new PageController(), definition: `
					<mvc:View
						xmlns="sap.m"
						xmlns:mvc="sap.ui.core.mvc"
						xmlns:core="sap.ui.core"
						xmlns:dnd="sap.ui.core.dnd">
						<VBox  class="sapUiSmallMarginBegin sapUiSmallMarginTopBottom" >
							<List
							items="{/ProductCollection}"
							includeItemInSelection="true">
								<items>
									<CustomListItem>
										<Panel expandable="true" expanded="false" headerText="{ProductId}">
											<headerToolbar>
												<OverflowToolbar>
													<Label text="{ProductId}"/>
													<ToolbarSpacer/>
													<Button icon="sap-icon://decline" press="onRemoveRow"/>
												</OverflowToolbar>
											</headerToolbar>
											<content>
												<List
												items="{ProductCollection}"
												includeItemInSelection="true">
													<InputListItem label="{ProductId}">
														<MultiComboBox items="{A>/types}" selectedKeys="{selectedkeys}" tooltip="ToolTip" width="200px">
															<core:ListItem key="{A>id}" text="{A>name}" additionalText="{A>name}"/>
														</MultiComboBox>
														<Button icon="sap-icon://decline" press="onRemoveCell"/>
													</InputListItem>
												</List>
											</content>
										</Panel>
									</CustomListItem>
								</items>
								<!--dragDropConfig>
									<dnd:DragDropInfo sourceAggregation="items" targetAggregation="items" dropEffect="Move" dropPosition="OnOrBetween" dragStart="treeTableDragStart" dragEnter="treeTableReorderDragEnter" drop="treeTableReorderDrop"/>
								</dragDropConfig-->
							</List>
							<HBox>
							<Button text="Add Floor" press="onAddFloor"/>
							<Button text="Add Cell" press="onAddCell"/>
							<Button text="Apply" press="onApply"/>
							</HBox>
						</VBox>
					</mvc:View>
				` }).then(function(view) {
					view.placeAt(div/* [0] */);
					that.view = view;
					if(that.onviewadded) {
						// that.onviewadded();
						setTimeout(that.onviewadded);
					}
				})
			});

			//this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
		}

		_submit() {
			var coll = this.view.getModel().getProperty("/ProductCollection");
			var parking = [];
			for(var i = 0; i < coll.length; ++i) {
				var row = [];
				parking.push(row);
				var r = coll[i].ProductCollection;
				for(var j = 0; j < r.length; ++j) {
					row.push(r[j].selectedkeys.reduce(function(a,b) { return parseInt(a) | parseInt(b); }, 0));
				}
			}
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
				detail: {
					properties: {
						parking: parking
					}
				}
			}));
		}

		set parking(newOpacity) {
			var that = this;
			var callback = function() {
				that.view.getModel().setProperty("/ProductCollection", newOpacity.map((x, i) => { return { ProductId: "floor" + i, Name: i, ProductCollection: x.map((y, j) => { return { ProductId: "column" + j, Name: "Row" + i, selectedkeys: function() {
					var a = [];
					var tmp  = y;
					for (var index = 1; tmp != 0; index<<=1) {
						if(tmp & index) {
							a.push(index);
							// Remove bit
							tmp &= ~index;
						}
					}
					return a;
				}()}}) }}));
			}
			if(this.view) {
				callback();
			} else {
				this.onviewadded = callback;
			}

			console.log("Tada");
		}
	}

	customElements.define("com-sample-parkhaus-builder", testwidgetBuilderPanel);
})();