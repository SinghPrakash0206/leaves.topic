import React from "react";
import fetch from "isomorphic-unfetch";
import {
  Grid,
  Image,
  Card,
  Icon,
  Popup,
  Pagination,
  Dropdown,
  Input,
  Form,
  List,
  Button,
  Select
} from "semantic-ui-react";
import Router from "next/router";
import Link from "next/link";
import TopicPagination from "../Pagination";
import axios from "axios";
import Parser from "html-react-parser";
import Highlight from "react-highlight";
import { format, distanceInWordsToNow, formatRelative, subDays } from 'date-fns'



const convertDate = (date) => {
  return distanceInWordsToNow(date, {includeSeconds: true,addSuffix: true});
}

class CardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topicList: this.props.data.list,
      activeTag: this.props.data.tag,
      queryTag: this.props.data.queryTag,
      activePage: this.props.data.activePage,
      linksCunt: this.props.data.linksCunt,
      tagsList: this.props.data.tagsList,
      filterTagsArray: this.props.data.tagsList,
      type: this.props.data.type,
      paginationURL: this.props.data.paginationURL,
      pageCount: Math.ceil(this.props.data.linksCunt / 20),
      pageNumber: this.props.data.activePage,
      sharingLinks: [],
      linksIdsString: "",
      modalBoxOpen: false,
      hostUrl: "",
      gridRowClass: "",
      isReaderActive: false,
      activeTabs: [],
      activeRead: null,
      startTabIndex: 0,
      endTabIndex: 0,
      activeTabId: 1,
      isLoading: false,
      readerSelectArray: [],
      mobileView: false,
      listOpen: false,
      readerMinimize: false,
      showTabPopup: false
    };
  }

  sortTagList(a) {
    a.sort(function(x, y) {
        return (x.active === y.active)? 0 : x.active ? -1 : 1;
    });
    return a
  }

  componentDidMount() {

    const isMobile = window.innerWidth <= 812;

    if(isMobile) {
    	this.setState({mobileView: true})
    }

    const activeTagValue = this.state.activeTag
    const tagsListArray = this.state.tagsList

    if(activeTagValue !== "Latest Leaves" ){
      var value = activeTagValue.split(',')
      for (var i = 0; i < tagsListArray.length; i++) {
        if(value.includes(tagsListArray[i].tagslug)){
          tagsListArray[i].active = true
        }else{
          tagsListArray[i].active = false
        }
      }
    }

    const sortedTagList = this.sortTagList(tagsListArray)

    this.setState({ hostUrl: window.location.host, tagsList:sortedTagList });
    var ids = localStorage.getItem("linksIds");
    var links = localStorage.getItem("sharingLinks");
    var activeRead = localStorage.getItem("activeRead");
    var activeTabId = localStorage.getItem("activeTabId");
    var activeTabs = localStorage.getItem("activeTabs");
    var endTabIndex = parseInt(localStorage.getItem("endTabIndex"));
    var startTabIndex = parseInt(localStorage.getItem("startTabIndex"));
    var isReaderActive = localStorage.getItem("isReaderActive");

    if (ids) {
      this.setState({ linksIdsString: JSON.parse(ids).linksIds });
    }

    if (links) {
      this.setState({ sharingLinks: JSON.parse(links).sharingLinks });
    }

    if (activeRead) {
      this.setState({ activeRead: JSON.parse(activeRead) });
    }

    if (activeTabId) {
      this.setState({ activeTabId: parseInt(activeTabId)});
    }

    if (activeTabs) {
      this.setState({ activeTabs: JSON.parse(activeTabs) });
    }

    if (endTabIndex) {
      this.setState({ endTabIndex: parseInt(endTabIndex)});
    }

    if (isReaderActive) {
      this.setState({ isReaderActive: isReaderActive === "false" ? false : true});
    }

    if (startTabIndex) {
      this.setState({ startTabIndex: parseInt(startTabIndex)});
    }
  }

  openModalBox = () => {
    this.setState({ modalBoxOpen: true });
  };

  closeModalBox = () => {
    this.setState({ modalBoxOpen: false });
  };

  clickOutModalBox = e => {
    if (e.target.id === "outer") {
      this.setState({ modalBoxOpen: false });
    }
  };

  handlePaginationChange = (e, { activePage }) => {
    this.setState({ activePage });
    Router.push(`/${this.state.paginationURL}/page/${activePage}`);
  };

  setTheLocalState(name, value){
    localStorage.setItem(name, value);
  }

  addToBundle(topicData, e) {
    var linksArray = this.state.sharingLinks;
    var linksIdsString = this.state.linksIdsString;
    var stringIdArray = linksIdsString.split(",");
    var stringIdIndex = stringIdArray.indexOf(String(topicData.id));
    if (stringIdIndex < 0) {
      linksArray.push(topicData);
      if (linksIdsString === "") {
        linksIdsString = linksIdsString + String(topicData.id);
      } else {
        linksIdsString = linksIdsString + "," + String(topicData.id);
      }
      this.setState({
        sharingLinks: linksArray,
        linksIdsString: linksIdsString
      });
      localStorage.setItem(
        "linksIds",
        JSON.stringify({ linksIds: linksIdsString })
      );
      localStorage.setItem(
        "sharingLinks",
        JSON.stringify({ sharingLinks: linksArray })
      );
    } else {
      alert("Already in the bundle");
    }
  }

  loadMoreLeaves = (e) => {
    let {pageNumber,queryTag, linksCunt, topicList, type} = this.state
    if(topicList.length < linksCunt){

    this.setState({isLoading: true})
    pageNumber++
    var url;
    if(queryTag === "Latest Leaves"){
      url = process.env.LEAVES_API_URL + 'api/entries?access_token='+process.env.LEAVES_API_ACCESSTOKEN+'&order=desc&page=1&sort=created&perPage=20&page='+pageNumber
    }else if(type === "searching"){
      url = 'http://stage.leaves.anant.us/solr/?q='+queryTag+'&rows=20&start='+ (pageNumber-1)*20
    }
    else {
      url = process.env.LEAVES_API_URL + 'api/entries?access_token='+process.env.LEAVES_API_ACCESSTOKEN+'&perPage=20&order=desc&page='+pageNumber+'&sort=created&tags=' + queryTag
    }
    var combinedArray;
    axios.get(url)
    .then((response) => {
      console.log(response)
      // handle success
      
      var loadMoreArray
      if(type === "searching") {
        loadMoreArray = response.data.response.docs
      }else{        
        loadMoreArray = response.data._embedded.items
      }
        combinedArray = [...topicList.slice(0, topicList.length), ...loadMoreArray.slice(0, loadMoreArray.length)]
      this.setState({pageNumber: pageNumber, topicList: combinedArray, isLoading: false})
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
    }


  }

  copyBundleLink() {
    var copyText = document.getElementById("bundleLink");
    copyText.select();
    document.execCommand("Copy");
    document.getElementById("copyMsg").innerHTML = "Copied!";
  }

  cleanModalBox(e) {
    var sharingLinks = this.state.sharingLinks;
    var linksIdsString = this.state.linksIdsString;
    linksIdsString = "";
    sharingLinks = [];
    this.setState({
      sharingLinks: sharingLinks,
      linksIdsString: linksIdsString
    });
    localStorage.setItem(
      "linksIds",
      JSON.stringify({ linksIds: linksIdsString })
    );
    localStorage.setItem(
      "sharingLinks",
      JSON.stringify({ sharingLinks: sharingLinks })
    );
    this.closeModalBox();
  }

  removeLink(id, e) {
    var sharingLinks = this.state.sharingLinks;
    var linksIdsString = this.state.linksIdsString;
    var stringIdArray = linksIdsString.split(",");
    var stringIdIndex = stringIdArray.indexOf(String(id));
    var linkObjectIndex = sharingLinks.findIndex(i => i.id === id);
    stringIdArray.splice(stringIdIndex, 1);
    sharingLinks.splice(linkObjectIndex, 1);
    this.setState({
      linksIdsString: stringIdArray.join(","),
      sharingLinks: sharingLinks
    });
    localStorage.setItem(
      "linksIds",
      JSON.stringify({ linksIds: stringIdArray.join(",") })
    );
    localStorage.setItem(
      "sharingLinks",
      JSON.stringify({ sharingLinks: sharingLinks })
    );
    if (stringIdArray.length === 0) {
      this.closeModalBox();
    }
  }

  addToReader = topic => {
    const isMobile = window.innerWidth <= 812;
    const selectArray = this.state.readerSelectArray;
    const activeTabs = this.state.activeTabs;
    const index = activeTabs.findIndex(x => x.id == topic.id);
    this.setState({ isReaderActive: true });
    this.setTheLocalState("isReaderActive", true)
    this.setState({readerMinimize: true })
    if (index < 0) {
      this.addToBundle(topic, null)
      this.setState({ activeTabId: topic.id });
      this.setTheLocalState("activeTabId", topic.id)
      topic["activeTab"] = true;
      this.setState({ activeRead: topic });
      this.setTheLocalState("activeRead", JSON.stringify(topic))
      activeTabs.push(topic);
      const tabLength = activeTabs.length;
      let { startTabIndex, endTabIndex } = this.state;
      if(isMobile){
        this.setState({ isReaderActive: false });
        this.setTheLocalState("isReaderActive", false)
        this.setState({mobileView: true})
        selectArray.push({ key: topic.id, value: topic.id, text: topic.title })
        for (var i = 0; i < activeTabs.length - 1; i++) {
          activeTabs[i]["activeTab"] = false;
        }
        activeTabs[activeTabs.length - 1]["activeTab"] = true;
        this.setState({ activeTabs, readerSelectArray: selectArray });
      
      }else{
        if (tabLength > 5) {
        startTabIndex = tabLength - 5;
        endTabIndex = tabLength - 1;

        for (var i = 0; i < activeTabs.length - 1; i++) {
          activeTabs[i]["activeTab"] = false;
        }

        for (var i = startTabIndex; i < endTabIndex; i++) {
          activeTabs[i]["activeTab"] = true;
        }
      } else {
        startTabIndex = 0;
        endTabIndex = tabLength - 1;
      }
      }


      this.setState({ startTabIndex: startTabIndex, endTabIndex: endTabIndex });
      this.setTheLocalState("startTabIndex", startTabIndex)
      this.setTheLocalState("endTabIndex", endTabIndex)

      this.setState({ activeTabs });
      this.setTheLocalState("activeTabs", JSON.stringify(activeTabs))
    } else {
        if(isMobile){
    this.setState({mobileView: true})
        for (var i = 0; i < activeTabs.length - 1; i++) {
          activeTabs[i]["activeTab"] = false;
        }
        const index = activeTabs.findIndex(x => x.id == topic.id);
        activeTabs[index]["activeTab"] = true;
        this.setState({activeTabs, activeRead: activeTabs[index], activeTabId: topic.id})

        }else{

      this.setState({ activeTabId: topic.id });
      this.setState({ activeRead: topic });
        }
    }
  };

  changeTab = topic => {
    this.setState({ activeTabId: topic.id });
    this.setState({ activeRead: topic });
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
    if (
      this.state.endTabIndex > 3 &&
      this.state.endTabIndex + 1 < this.state.activeTabs.length
    ) {
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
      this.setTheLocalState("isReaderActive", false)
      this.setTheLocalState("startTabIndex", 0)
      this.setTheLocalState("endTabIndex", 0)
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
      this.setTheLocalState("startTabIndex", startTabIndex)
      this.setTheLocalState("endTabIndex", endTabIndex)
      activeRead = remainTabs[remainTabs.length - 1];
      activeTabId = remainTabs[remainTabs.length - 1].id;
    } else {
      remainTabs = activeTabs
        .slice(0, index)
        .concat(activeTabs.slice(index + 1, activeTabs.length));
      activeRead = remainTabs[remainTabs.length - 1];
      activeTabId = remainTabs[remainTabs.length - 1].id;
    }

    this.removeLink(topic.id, null)
    this.setState({ activeTabs: remainTabs, activeTabId, activeRead });

    this.setTheLocalState("activeTabs", JSON.stringify(remainTabs))
    this.setTheLocalState("activeTabId", activeTabId)
    this.setTheLocalState("activeRead", JSON.stringify(activeRead))
  };

  filterTags = (e) => {
    let tags = this.state.filterTagsArray
    var filterTagsArray = []

    if(!e.target.value){
      this.setState({tagsList: this.state.filterTagsArray})
    }else{
    for (var i = 0; i < tags.length; i++) {
      if(String(tags[i].title).includes(e.target.value)){
        filterTagsArray.push(tags[i])
      }
    }
    this.setState({tagsList:filterTagsArray})
    }
  }

  miniMobile = () => {
    this.setState({readerMinimize: this.state.readerMinimize ? false : true})
  }

  selectReaderTab = (topicId) => {
    const activeTabs = this.state.activeTabs
    const index = activeTabs.findIndex(x => x.id == topicId);
    this.setState({activeRead: activeTabs[index]})
  }

  removeActiveTag = (tags, tag) => {
    var tagArr = tags.split(',')
    var index = tagArr.indexOf(tag)
    if(index > -1){
      tagArr.splice(index, 1);
    }
    return tagArr.join(',')
  }

  openMobileTabs = () => {
    const tabPopup = this.state.showTabPopup ? false : true
    this.setState({ showTabPopup: tabPopup})
  }

  render(props) {
    const {
      topicList,
      activeTag,
      activePage,
      linksCunt,
      pageCount,
      queryTag,
      paginationURL,
      sharingLinks,
      modalBoxOpen,
      linksIdsString,
      hostUrl,
      type,
      activeRead,
      activeTabId,
      tagsList
    } = this.state;
    const { activeTabs } = this.state;
    return (
      <div>
        {modalBoxOpen ? (
          <div className="add-leaf-outer" onClick={this.clickOutModalBox.bind(this)} id="outer" >
            <div className="add-leaf-modal">
              <div className="share-modal-title">Share This Bundle</div>
              <div className="share-link-list">
                {sharingLinks.map((link, index) => (
                  <div className="link-list" key={link.id} value={link.id}>
                    <div>{link.title}</div>
                    <div
                      onClick={this.closeTab.bind(null, link, index)}
                      className="remove-link"
                    >
                      <span>x</span>
                    </div>
                  </div>
                ))}
              </div>
              <br />
              <Input id="bundleLink" fluid icon={<Icon name="copy" onClick={this.copyBundleLink} inverted circular link />} value={`${hostUrl}/bundle/${linksIdsString}`}
              />
              <div id="copyMsg" />
              <div className="share-modal-btn" onClick={this.closeModalBox}>
                <Icon className="icon-class" link name="window close" size="small" />{" "}
                close
              </div>
              {/*<div className="share-modal-btn" onClick={this.cleanModalBox.bind(this)} >
                              <Icon className="icon-class" link name="erase" size="small" />{" "}
                              clear
                            </div>*/}
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="container">
          <div className="navbar-drawer">
          <div className="search-tag-input">
            {!this.state.mobileView ? <Input size='small' id="search-tag-input" style={{padding: 15, position: 'fixed'}} onChange={this.filterTags.bind(this)} focus placeholder='Search Your Tag' /> : ''}
          </div>
            <ul className="ul-list">
              {tagsList
                ? tagsList.map((tag, index) => (
                    <li key={index}>
                      <Link href={activeTag === tag.tagslug ? '/latest-leaves' : `/topic/${activeTag !== "Latest Leaves" ? (!activeTag.includes(tag.tagslug) ? activeTag+','+tag.tagslug : this.removeActiveTag(activeTag, tag.tagslug)) : tag.tagslug}`}>
                        <a className={tag.active ? 'tag-active' : ''}>{tag.label}</a>
                      </Link>
                    </li>
                  ))
                : ""}
            </ul>
          </div>
          {this.props.data.type === 'searching' ? <div className="search-card-msg"> {this.props.data.linksCunt + ' Results found : ' + this.props.data.queryTag}</div> : ''}
          <div className="content-section">
            <div className="card-content">
              <div className={this.state.isReaderActive & !this.state.mobileView ? "card-container-reader" : "card-container" }>
                <div className="cards" style={{ height: "calc(100vh - 74px)", "overflowY": "scroll" }} >
                  {topicList.map((topic, index) => {
                  	return topic.url !== "" ?
                    <div className="card-list" key={topic.id}>
                      <div className="topic-card">
                        <div className="topic-image" onClick={this.addToReader.bind(null, topic)}>
                          <div className="topic-transparent-layer" style={{backgroundImage: `url(${topic.preview_picture})`, backgroundSize: 'cover',backgroundRepeat: 'no-repeat'}}>
                            <div className="show-this-layer">
                              <span>
                                <Popup trigger={ <Icon onClick={this.addToBundle.bind( this, topic )} value={topic.url} className="icon-class" link name="pin" size="large" /> } content="Add to bundle & share" />
                              </span>
                              <span>
                                <a href={topic.url} target="_blank">
                                  <Popup trigger={ <Icon className="icon-class" link name="external alternate" size="large" /> } content="Original Resource" />
                                </a>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                        <div className="topic-content" onClick={this.addToReader.bind(null, topic)} >
                          <div className="title">{topic.title}</div>
                          <div className="domain_name">{topic.domain_name}</div>
                          <ul className="leaves-meta">
                            <li><Icon name="user"/> {topic.user_name}</li>
                            <li><Icon name="calendar outline"/> {convertDate(topic.created_at)}</li>
                          </ul>                       
                        </div>
                    </div>
                  : ''})}
                <div className="height-divider"></div>
                  {activePage > 0 && linksCunt > topicList.length
                    ?
                <div className="pagination">
                {this.state.isLoading ?
                  <Button basic loading> Loading </Button>
                :
                <Button basic  onClick={this.loadMoreLeaves.bind(this)}> Load More Topics</Button>
                }
                </div>
                  : ''}
                  {/*<div className="pagination" ><TopicPagination defaultActivePage={activePage} totalPages={pageCount} tag={queryTag} type={type}/></div>*/}
                <div className="height-divider"></div>
                </div>
                <div className={ this.state.isReaderActive & !this.state.mobileView ? "reader reader-block" : "reader" } >
                  <div className="reader-inner" >
                    <div className="reader-tabs">                      
                      {activeTabs.length > 5 ? (
                        <div className="tab-name">
                        <div className="tab-title" onClick={this.moveTabLeft.bind(null)} >
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
                      <div className="shareButton" onClick={this.openModalBox}><Icon className="icon-class" link name="share alternate" size="large" /> {sharingLinks.length}</div>
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
                      {/*<div className="reader-action-icon">
                                              <Icon onClick="" name="window maximize outline"/>
                                              <Icon onClick="" name="window minimize"/>
                                            </div>*/}
                    </div>
                    <div className="reader-content">
                    {activeRead == null ? "" :
                    <div className="content-meta">
                      <h2>{activeRead.title}</h2>
                      <small>{activeRead.domain_name}</small>
                      <ul>
                        <li><Icon name="user"/> {activeRead.user_name}</li>
                        <li><Icon name="calendar alternate"/> {convertDate(activeRead.created_at)}</li>
                        <li><Icon name="linkify"/> <a href={activeRead.url} target="_blank">link</a></li>
                      </ul>
                    </div>
                    }
                      {activeRead == null
                        ? ""
                        : Parser(activeRead.content.trim(), {
                            replace: function(domNode) {
                              if (domNode.attribs && domNode.name === "img") {
                                return (
                                  <img src={domNode.attribs.src} style={{ maxWidth: "100%", display: "block" }} />
                                );
                              }
                              if (domNode.attribs && domNode.name === "pre") {
                                console.log(domNode.children[0])
                                return (
                                  <Highlight>
                                    <pre>{domNode.children[0].data === undefined ? '' : domNode.children[0].data}</pre>
                                  </Highlight>
                                );
                              }
                            }
                          })}
                    }

           				<div className="height-divider"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {activeTabs.length > 0 && this.state.mobileView ? 
          <div className={ this.state.readerMinimize ? "mobile-reader" : "mini-reader" } >
                  <div className="reader-inner" >
                  {this.state.showTabPopup ? 
                    <div className="mobile-tab-popup" onClick={this.openMobileTabs.bind(null)}>
                      <div className="tab-popup-inner">
                      {this.state.activeTabs ? this.state.activeTabs.map((tab, index) => (
                        <div className="mobile-popup-tab">
                          <div className="mobile-popup-title" onClick={this.selectReaderTab.bind(null, tab.id)}>        {tab.title}
                          </div>
                          <div className="mobile-tab-remove" onClick={this.closeTab.bind(null, tab, index)}>x</div>
                        </div>
                      )): ''}
                      </div>
                    </div> : 
                  ''}
                  
                  <div className="mobile-reader-head">
                  <div className="mobile-reader-tabs">
                  {activeRead ? <div className="mobile-tab-head" onClick={this.openMobileTabs.bind(null)}>{activeRead.title}</div>: ''}

                  {/* <select onChange={this.selectReaderTab.bind(this)}>
                  {this.state.activeTabs ? this.state.activeTabs.map((tab, index) => (
                    tab.activeTab ? <option key={tab.id} value={tab.id} id={index} index={index} selected>{tab.title}</option> : <option key={tab.id} value={tab.id}>{tab.title}</option>
                  )): ''}
                  </select> */}
                  </div>
                  <div className="head-icons">{this.state.readerMinimize ? <Icon name="window minimize" onClick={this.miniMobile.bind(this)}/> : <Icon name="window maximize outline" onClick={this.miniMobile.bind(this)}/>}</div>
                  </div>
                  

                    <div className="reader-content">
                    {activeRead == null ? "" :
                    <div className="content-meta">
                      <h2>{activeRead.title}</h2>
                      <small>{activeRead.domain_name}</small>
                      <ul>
                        <li><Icon name="user"/> {activeRead.user_name}</li>
                        <li><Icon name="calendar alternate"/> {convertDate(activeRead.created_at)}</li>
                        <li><Icon name="linkify"/> <a href={activeRead.url} target="_blank">link</a></li>
                      </ul>
                    </div>
                    }
                      {activeRead == null
                        ? ""
                        : Parser(activeRead.content, {
                            replace: function(domNode) {
                              if (domNode.attribs && domNode.name === "img") {
                                return (
                                  <img src={domNode.attribs.src} style={{ maxWidth: "100%", height: "auto", display: "block" }} />
                                );
                              }
                              if (domNode.attribs && domNode.name === "pre") {
                                return (
                                  <Highlight>
                                    <pre>{domNode.children[0].data}</pre>
                                  </Highlight>
                                );
                              }
                              if (domNode.attribs && domNode.name === "iframe") {
                                return (
                                   <iframe id={domNode.attribs.id} src={domNode.attribs.src} allowfullscreen="" width="100%" height="auto" frameborder="0">[embedded content]</iframe>
                                );
                              }
                            }
                          })}

                  <div className="height-divider"></div>
                    </div>
                  </div>
                </div>
                :''}

        </div>
        <style jsx>{`
         .container .navbar-drawer {
             display: inline-block;
             width: 0px;
             float: left;
             height: calc(100vh - 74px);
             overflow: hidden;
             background-color: #f6f8f9;
        }
         @media only screen and (min-width: 1100px) {
             .container .navbar-drawer {
                 display: inline-block;
                 width: 240px;
                 float: left;
                 height: calc(100vh - 74px);
                 overflow: hidden;
                 background-color: #f6f8f9;
            }
             .container .content-section {
                 display: inline-block;
                 width: calc(100% - 240px);
                 float: right;
                 height: calc(100vh - 74px);
                 margin-top: -10px;
                 background-color: #fff 
            }
        }
         @media only screen and (max-width: 1100px) {
             .search-tag-input {
                 display: none !important;
                 border: 1px solid red;
            }
        }

        .content-meta h2{
          padding:0;
          margin: 0;
          font-size: 2.5rem;
          line-height: 2.5rem;
        }

        .content-meta ul {
          padding: 0;
          margin: 0px 0px 20px 0px;
        }

        .content-meta ul li {
          display: inline-block;
          padding:3px 10px 3px 0px;
        }

        .card-clicked {
          height: 160px;
          width: 100%;
          z-index: 99;
          position: absolute;
          text-align: center;
          display: table; 
        }

        .card-clicked .card-loading {
          display: table-cell;
          width: 100%;
          height: 160px;
          padding: 10px;
          vertical-align: middle;
        }

         .leaves-meta {
             padding: 0;
             list-style: none;
             margin: 0;
             opacity: 0.6 
        }
         .leaves-meta li {
             display: inline-block;
             padding: 5px 5px 5px 0px;
        }
         .ul-list {
             list-style: none;
             margin: 0;
             padding: 0;
             height: calc(100vh - 74px);
             margin-right: -16px !important;
             overflow-y: scroll;
             overflow-x: hidden;
             margin-top: 60px;
        }

        .ul-list .tag-active:after {
          content: "✓";
          height: 5px;
          width: 5px;
          color: green;
        }

         .ul-list:hover {
             margin-right: 0px !important;
        }
         .ul-list li {
             padding: 4px;
        }
         .ul-list li a{
             font-family: "Questrial", sans-serif;
             color: #2d2c2c;
             font-size: 16px;
             display: block;
             padding-left: 10px;
        }
         .ul-list li:hover {
             background-color: #cdcdcd;
        }
         .container .content-section {
             display: inline-block;
             float: right;
             height: calc(100vh - 74px);
             margin-top: -10px background-color: #fff;
        }
         .card-section {
             max-width: 80%;
             margin: 0px auto;
             background-color: #eee;
        }
         .card-container .cards {
             display: grid;
             grid-gap: 20px;
             grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
             padding: 10px;
             background-color: #eeeeee;
        }
         .card-container .cards .card-list{
          -webkit-box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
          box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
          background-color: #fff;
          max-height: 280px;
          margin-bottom: 10px;
         }
         .card-container-reader .cards{
             padding: 10px;
             background-color: #eeeeee;
         }
         .card-container-reader .cards .card-list{
          -webkit-box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
          box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
          background-color: #fff;
          margin-bottom: 10px;
          max-height: 280px;
         }
         @media only screen and (max-width: 768px) {
             .card-container .cards {
                 display: block;
            }
             .card-container .cards .card-list {
             display: grid;
             grid-gap: 10px;
             grid-template-columns: 50% 50%;
             padding: 10px;
            }
        }
         @media only screen and (max-width: 500px) {
             .card-container .cards {
                 display: block;
            }
             .card-container .cards .card-list {
                 width: 100%;
                 display: inline-block;
                 padding: 10px;
            }
        }
         .height-divider {
             height: 100px;
        }
         .card-container {
             overflow: hidden;
        }
         .card-container-reader {
             display: grid;
             grid-template-columns: 25% 75%;
             overflow: hidden;
        }
         @media only screen and (max-width: 768px) {
             .card-container-reader .reader{
                 position: absolute;
                 top: 0;
                 z-index: 999;
                 margin: 0;
            }
             .reader-content {
                 height: 100vh !important;
                 overflow-x: hidden;
            }
        }
         .card-container-reader .cards {
             margin-right: -27px !important;
             overflow-y: scroll;
             overflow-x: hidden;
             padding-right: 5px;
        }
         .reader {
             display: none;
             margin: 0px 10px;
             position: relative;
             padding-left: 20px;
        }
         .mini-reader {
             position: fixed;
             height: 32px;
             bottom: 0;
             width: 100%;
             z-index: 999;
             background-color: #eee;
        }
         .mobile-reader {
             display: block !important;
             position: absolute;
             top: 0;
             background-color: #fff;
             z-index: 999;
             width: 100%;
             height: 100vh;
        }

        .mobile-reader-head {
          display: grid;
          grid-template-columns: 90% 10%;
          align-items: center;
        }

        .mobile-tab-head {
          padding: 8px;
          font-size: 1.2rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mobile-tab-popup {
          position: absolute;
          height: 100vh;
          width: 100%;
          background-color: rgba(0,0,0,0.2)
        }

        .mobile-popup-tab .mobile-popup-title {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding: 5px;
        }

        .mobile-popup-tab {
          display: grid;
          grid-template-columns: auto 40px;
          border: 1px solid #333;
        }

        .mobile-popup-tab .mobile-tab-remove {
          font-size: 1.5rem;
          text-align: center;
          background-color: #eee;
          color: #000;
        }

        .tab-popup-inner {
          background-color: #fff;
          position: relative;
          margin: 3rem;
          max-height: 60%;
          overflow-y: scroll;
          z-index: 9999;
        }

        .mobile-reader-tabs select {
          width: 100%;
          font-size: 1em;
        }

        .mobile-reader-tabs select{
          font-size: 17px;
          padding: 5px;
         font-family: "Questrial", sans-serif;
        }

        .head-icons{
          text-align: center;
          font-size: 18px;
          background-color: #eee;
          cursor: pointer;
          height: 100%;
          align-items: center;
        }

         .reader-block {
             display: block;
        }
         .reader-inner {
             background-color: #fff;
        }
         .reader-inner-fixed {
             position: fixed;
             width: 58.5%;
             top: 5px;
        }
         .reader .reader-tabs {
             display: grid;
             grid-gap: 0px;
             grid-template-columns: 30px repeat(5, 1fr) 30px 30px;
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
         .reader-action-icon {
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
         .share-icon {
             position: fixed;
             right: 10px;
             top: 100px;
        }
         .sharing-link-count {
             background-color: #eee;
             border-radius: 4px;
             position: relative;
             right: 18px;
             padding: 5px;
             z-index: 0;
             cursor: pointer;
        }
         .share-link-list {
             max-height: 400px;
             overflow-y: scroll;
        }
         .share-modal-title {
             font-size: 20px;
             font-weight: 700;
             margin-bottom: 20px;
             font-family: "Roboto Mono", monospace;
        }
         .share-modal-btn {
             font-size: 16px;
             background-color: #eee;
             padding: 3px 10px;
             display: inline-block;
             border-radius: 3px;
             margin-top: 20px;
             cursor: pointer;
             margin-right: 10px;
        }
         .link-list {
             padding: 5px;
             background-color: #eee;
             margin: 3px;
             display: grid;
             grid-template-columns: 90% 10%;
        }
         .remove-link span{
             background-color: #8d8d8e;
             color: #fff;
             padding: 1px 7px;
             border-radius: 50%;
             font-weight: 700;
             font-size: 14px;
             cursor: pointer;
        }
         .copy-bundle-link {
             width: 100%;
             margin-top: 20px;
             padding: 6px;
             border: 2px solid #333;
        }
         .topic-label {
             font-size: 30px;
             font-weight: 700;
             font-family: "Roboto Mono", monospace;
             color: #2d2c2c;
             opacity: 0.8;
             width: 100%;
             padding: 20px 0px 10px 10px;
             letter-spacing: -2px;
             word-spacing: -12px;
        }
         .topic-card {
             position: relative;
             height: 160px;
             margin-bottom: 10px;
        }
         .topic-image img {
             vertical-align: middle;
        }
         .topic-image {
             height: 160px;
             overflow: hidden;
        }
         .topic-transparent-layer {
             position: absolute;
             width: 100%;
             height: 160px;
             z-index: 1;
        }
         .topic-transparent-layer .show-this-layer {
             color: #fff;
             display: none;
        }
         .show-this-layer a {
             color: #fff;
        }
         .show-this-layer span {
             background-color: #4d4d4d;
             padding: 9px 2px 9px 5px;
             border-radius: 50%;
             margin: 5px;
        }
         .show-this-layer {
             margin-top: 60px;
             display: inline-block;
             text-align: center;
        }
         .show-this-layer .icon-class {
             background-color: rgba(0, 0, 0, 0.5);
        }
         .topic-transparent-layer:hover .show-this-layer {
             display: block;
        }
        .topic-content {
             padding: 10px;

        }
         .topic-content .title {
             cursor: pointer;
             font-size: 1.2rem;
             max-height: 2.8rem;
             overflow: hidden;
             font-family: "Questrial", sans-serif;
        }
         .pagination {
             margin: 0px auto;
             grid-column: 4/2;
             text-align: center;
        }
         .search-box {
             padding-top: 20px;
        }
         .add-leaf-modal {
             border: 1px solid #eee;
             border-radius: 10px;
             max-width: 500px;
             margin: 0px auto;
             background-color: #fff;
             padding: 20px;
        }
         .add-leaf-outer {
             position: fixed;
             z-index: 99;
             padding-top: 100px;
             left: 0;
             top: 0;
             width: 100%;
             height: 100%;
             overflow: auto;
             background-color: rgba(0, 0, 0, 0.4);
        }
        .search-card-msg {
          height: 30px;
          font-size: 16px;
        }

        `}</style>
      </div>
    );
  }
}

export default CardList;
