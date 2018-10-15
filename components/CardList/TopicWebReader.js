import React, {Component} from "react";
import Parser from "html-react-parser";
import Highlight from "react-highlight";

class TopicWebReader extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.reader)
  }


  componentWillReceiveProps(){
  	const {isReaderActive, activeTabs, activeRead, startTabIndex, endTabIndex, activeTabId} = this.props.reader
  	this.setState({isReaderActive, activeTabs, activeRead, startTabIndex, endTabIndex, activeTabId})
  }

  changeTab = topic => {
    this.setState({ activeTabId: topic.id });
    this.setState({ activeRead: topic });
  };
  closeTab = (topic, index) => {
    let { startTabIndex, endTabIndex } = this.state;
    var activeTabs = this.state.activeTabs;
    var remainTabs, activeTabId, activeRead;
    if (activeTabs.length === 1) {
      remainTabs = [];
      activeRead = null;
      activeTabId = 1;
      this.setState({
        startTabIndex: 0,
        endTabIndex: 0,
        isReaderActive: false
      });
    } else if (activeTabs.length > 5) {
      remainTabs = activeTabs
        .slice(0, index)
        .concat(activeTabs.slice(index + 1, activeTabs.length));
      var currentTabsLength = remainTabs.length;
      startTabIndex = currentTabsLength - 5;
      endTabIndex = currentTabsLength - 1;

      for (var i = 0; i < currentTabsLength - 1; i++) {
        remainTabs[i]["activeTab"] = false;
      }

      for (var j = startTabIndex; j < endTabIndex; j++) {
        remainTabs[j]["activeTab"] = true;
      }
      this.setState({ startTabIndex, endTabIndex });

      activeRead = remainTabs[remainTabs.length - 1];
      activeTabId = remainTabs[remainTabs.length - 1].id;
    } else {
      remainTabs = activeTabs
        .slice(0, index)
        .concat(activeTabs.slice(index + 1, activeTabs.length));
      activeRead = remainTabs[remainTabs.length - 1];
      activeTabId = remainTabs[remainTabs.length - 1].id;
    }

    this.setState({ activeTabs: remainTabs, activeTabId, activeRead });
  };


  moveTabLeft = () => {
    if (this.state.startTabIndex > 0) {
      const { startTabIndex, endTabIndex } = this.state;
      const activeTabs = this.state.activeTabs;
      this.setState({
        startTabIndex: startTabIndex - 1,
        endTabIndex: endTabIndex - 1
      });

      const index = activeTabs.findIndex(x => x.id == this.state.activeTabId);

      for (var i = 0; i < activeTabs.length; i++) {
        activeTabs[i]["activeTab"] = false;
      }

      for (var j = startTabIndex - 1; j <= endTabIndex - 1; j++) {
        activeTabs[j]["activeTab"] = true;
      }
      this.setState({ activeTabId: activeTabs[index - 1].id });
      this.setState({ activeRead: activeTabs[index - 1] });

      this.setState({ activeTabs });
    }
  };

  moveTabRight = () => {
    console.log(this.state.activeTabs.length);
    console.log(this.state.endTabIndex);
    if (
      this.state.endTabIndex > 3 &&
      this.state.endTabIndex + 1 < this.state.activeTabs.length
    ) {
      console.log("right");
      const { startTabIndex, endTabIndex } = this.state;
      const activeTabs = this.state.activeTabs;
      this.setState({
        startTabIndex: startTabIndex + 1,
        endTabIndex: endTabIndex + 1
      });

      const index = activeTabs.findIndex(x => x.id == this.state.activeTabId);

      for (var i = 0; i < activeTabs.length; i++) {
        activeTabs[i]["activeTab"] = false;
      }

      for (var j = startTabIndex + 1; j <= endTabIndex + 1; j++) {
        activeTabs[j]["activeTab"] = true;
      }
      this.setState({ activeTabId: activeTabs[index + 1].id });
      this.setState({ activeRead: activeTabs[index + 1] });

      this.setState({ activeTabs });
    }
  };
	render(){
		const {isReaderActive, activeTabs, activeRead, startTabIndex, endTabIndex, activeTabId} = this.props.reader
		return (
			<div className="reader-inner" >
                    <div className="reader-tabs">                      
                      {activeTabs.length > 5 ? (
                        <div className="tab-name">
                        <div className="tab-title" moveLeft={this.moveTabLeft.bind(null)} >
                          &lt;
                        </div>
                        <div className="close-tab" />
                      </div>
                      ) : (
                        <div></div>
                      )}
                      {activeTabs.map((tab, index) => {
                        if (tab.activeTab) {
                          return (
                            <div className={ tab.id === activeTabId ? "tab-name active-tab" : "tab-name" } key={tab.id} >
                              <div className="tab-title" onClick={this.changeTab.bind(null, tab)} >
                                {tab.title}
                              </div>
                              <div className="close-tab" onClick={this.closeTab.bind(null, tab, index)} >
                                x
                              </div>
                            </div>
                          );
                        }
                      })}
                      {activeTabs.length > 5 ? (
                        <div className="tab-name">
                          <div className="tab-title" onClick={this.moveTabRight.bind(null)} >
                            &gt;
                          </div>
                          <div className="close-tab" />
                        </div>
                      ) : (
                        <div></div>
                      )}
                      <div>
                        max
                      </div>
                    </div>
                    <div className="reader-content">
                      {activeRead == null
                        ? ""
                        : Parser(activeRead.content, {
                            replace: function(domNode) {
                              if (domNode.attribs && domNode.name === "img") {
                                return (
                                  <img src={domNode.attribs.src} style={{ maxWidth: "100%", display: "block" }} />
                                );
                              }
                              if (domNode.attribs && domNode.name === "pre") {
                                return (
                                  <Highlight>
                                    <pre>{domNode.children[0].data}</pre>
                                  </Highlight>
                                );
                              }
                            }
                          })}

           				<div className="height-divider"></div>
                    </div>
                    <style jsx>{`


      @media only screen and (max-width: 800px) {
        .reader{
          position: absolute;
          top: 0;
          z-index: 99;
          margin: 0;
        }
        .reader-content {
          height: 100vh !important; 
        }
      }

      .reader {
            display: none;
            margin: 0px 10px;
            position: relative;
            background-color: #fff;
          }

          .reader-block {
            display: block;
          }

          .reader-inner {
          }

          .reader-inner-fixed {
            position: fixed;
            width: 58.5%;
            top: 5px;
          }

          .reader-tabs {
            display: grid;
            grid-gap: 0px;
            grid-template-columns: 30px repeat(5, 1fr) 30px 60px;
            cursor: pointer;
          }

          .reader-tabs .tab-name {
            padding: 5px;
            border: 1.5px solid #707070;
            font-family: "Questrial", sans-serif;
            display: grid;
            grid-template-columns: 80% 20%;
          }

          .reader-tabs .tab-name .tab-title {
            white-space: nowrap;
            overflow: hidden;
          }

          .reader-tabs .tab-name .close-tab {
            text-align: center;
          }

          .reader-content {
            font-family: "Questrial", sans-serif;
            padding: 20px;
            height: calc(100vh - 105px);
            overflow-y: scroll;
            border: 2px solid #707070;
          }

          .active-tab {
            background-color: #645f5f;
            color: #fff;
          }
                    	`}</style>`
                  </div>
		)
	}
}

export default TopicWebReader