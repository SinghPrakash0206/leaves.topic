import React from "react";
import ReactDOM from "react-dom";
import Tabs, { TabPane } from "rc-tabs";
import TabContent from "rc-tabs/lib/TabContent";
import ScrollableInkTabBar from "rc-tabs/lib/ScrollableInkTabBar";

// import "rc-tabs/assets/index.css";

let index = 1;

export default class ReaderTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        {
          title: "Google News",
          content: "Today we are celebrating 20th birthday"
        }
      ],
      activeKey: "Google News"
    };
  }

  onTabChange = activeKey => {
    this.setState({
      activeKey
    });
  };

  constructTabReader() {
    return this.state.tabs.map(t => {
      return (
        <TabPane
          tab={
            <span>
              {t.title}
              <a
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  color: "red",
                  right: 5,
                  top: 0
                }}
                onClick={this.remove.bind(this, t.title)}
              >
                x
              </a>
            </span>
          }
          key={t.title}
        >
          <div>{t.content}</div>
        </TabPane>
      );
    });
  }

  remove = (title, e) => {
    e.stopPropagation();
    if (this.state.tabs.length === 1) {
      alert("You can't delete this");
      return;
    }
    let foundIndex = 0;
    const after = this.state.tabs.filter((t, i) => {
      if (t.title !== title) {
        return true;
      }
      foundIndex = i;
      return false;
    });
    let activeKey = this.state.activeKey;
    if (activeKey === title) {
      if (foundIndex) {
        foundIndex--;
      }
      activeKey = after[foundIndex].title;
    }
    this.setState({
      tabs: after,
      activeKey
    });
  };

  add = e => {
    e.stopPropagation();
    index++;
    const newTab = {
      title: `Title: ${index}`,
      content: `Content: ${index}`
    };
    this.setState({
      tabs: this.state.tabs.concat(newTab),
      activeKey: `Title: ${index}`
    });
  };

  render() {
    const tabStyle = {
      width: 500
    };

    return (
      <div style={tabStyle}>
        <button onClick={this.add}>+add leaf</button>
        <Tabs
          renderTabBar={() => <ScrollableInkTabBar />}
          renderTabContent={() => <TabContent />}
          activeKey={this.state.activeKey}
          onChange={this.onTabChange}
        >
          {this.constructTabReader()}
        </Tabs>
      </div>
    );
  }
}
