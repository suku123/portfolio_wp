
// BHO object for communicating back to our extension for IE
var bhoSWLModule = null;

var swl_core =
{
    logging: false,

    baseurl: "http://smileyswelove.com",

    facebookAppId: "399287686754495",

    mySmileysExtendedEmptyText: "<p><i>Note: You can create new smileys on <a id='swl_addSmileys' href='http://smileyswelove.com/upload/image'>SmileysWeLove.com website</a> or by right-clicking on any image/video on a webpage and selecting 'Add as new smiley...'</i></p><hr />",
    favoritesExtendedEmptyText: "<p><i>Note: You can mark smileys as favorites on <a id='swl_addFavoriteSmileys' href='http://smileyswelove.com'>SmileysWeLove.com website</a> or by clicking on the star icon in the smiley overlay...'</i></p><hr />",

    smileyChatPopupRequest: new XMLHttpRequest(),
    smileyJSRequest: new XMLHttpRequest(),

    lazyLoaderContainer: ".swl_chatSmileyPopup #swl_right",

    inLimitedResize: false,

    smileyConfigurations:
        [
            {
                prefixNoUrl: "~ ",
                urlNoProtocol: "smileyswelove.com/",
                url: "http://smileyswelove.com/",
                prefix: "~ http://smileyswelove.com/",
                postfix: " ~"
            },
            {
                prefixNoUrl: "~ ",
                urlNoProtocol: "swl1.us/",
                url: "http://swl1.us/",
                prefix: "~ http://swl1.us/",
                postfix: " ~"
            },
            {
                prefixNoUrl: "I just sent you this very cool smiley! To view click here:",
                urlNoProtocol: "smileyswelove.com/free-smiley/",
                url: "http://www.smileyswelove.com/free-smiley/",
                prefix: "I just sent you this very cool smiley! To view click here:http://www.smileyswelove.com/free-smiley/",
                postfix: " ..."
            }
        ],

    smileyNonLinkConfigurations:
        [
            {
                prefixNoUrl: "~",
                urlNoProtocol: "smileyswelove/",
                url: "smileyswelove/",
                prefix: "~ smileyswelove/",
                postfix: " ~"
            }
        ],

    log: function (s)
    {
        if (swl_core.logging)
        {
            console.log("[swl_core] " + s);
        }
    },

    ping: function (host, callback)
    {
        swl_core.log("ping: " + host);

        var started = new Date().getTime();

        var http = new XMLHttpRequest();
        http.open("GET", host + "?cachebreaker=" + started, /*async*/true);
        http.onreadystatechange = function()
        {
            try
            {
                swl_core.log("onreadystatechange:" + http);
                if (http.status == 200)
                {
                    var ended = new Date().getTime();
                    var milliseconds = ended - started;
                    if (callback != null)
                    {
                        callback(milliseconds);
                    }
                }
            }
            catch (ex)
            {
                swl_core.log("onreadystatechange exception:" + ex);
            }
        };
        try
        {
            http.send(null);
        }
        catch (ex)
        {
            // this is expected
            swl_core.log("ping send exception:" + ex);
        }
    },

    getShortPrefix: function()
    {
        return swl_core.smileyConfigurations[1].prefix;
    },

    getShortPostfix: function()
    {
        return swl_core.smileyConfigurations[1].postfix;
    },

    isIE: function()
    {
        return SWL.$.browser == "msie" || SWL.$.browser.msie;
    },

    isMozilla: function()
    {
        return SWL.$.browser.mozilla;
    },

    isWordpressSite: function()
    {
        return !swl_core.isIFrame() && SWL.$("meta[name='generator'][content^='WordPress']").length > 0;
    },

    isDisqusSite: function()
    {
        return window.location && window.location.href && window.location.href.indexOf("disqus.com/embed/comments") != -1;
    },

    isYoutubeSite: function()
    {
        return !swl_core.isIFrame() && window.location && window.location.href && window.location.href.indexOf("youtube.com") != -1;
    },

    isTumblrSite: function()
    {
        return !swl_core.isIFrame() && window.location && window.location.href && window.location.href.indexOf("tumblr.com") != -1;
    },

    isFacebookSite: function()
    {
        return window.location && window.location.href && window.location.href.indexOf("facebook.com") != -1;
    },

    isTwitterSite: function()
    {
        return !swl_core.isIFrame() && window.location && window.location.href && window.location.href.indexOf("twitter.com") != -1;
    },

    isFlickrSite: function()
    {
        return !swl_core.isIFrame() && window.location && window.location.href && window.location.href.indexOf("flickr.com") != -1;
    },

    isYahooSite: function()
    {
        return !swl_core.isIFrame() && window.location && window.location.href && window.location.href.indexOf("mail.yahoo.com") != -1;
    },

    isHotmailSite: function()
    {
        return window.location && window.location.href && window.location.href.indexOf("mail.live.com") != -1;
    },

    isGTalkSite: function()
    {
        return (!swl_core.isIFrame() && window.location && window.location.href && (window.location.href.indexOf("mail.google.com") != -1 || window.location.href.indexOf("plus.google.com") != -1)) ||
                (window.location && window.location.href && window.location.href.indexOf("talkgadget.google.com") != -1);
    },

    isIFrame: function()
    {
        if (swl_core.isMozilla())
        {
            return (unsafeWindow.top.location != unsafeWindow.location);
        }
        else
        {
            return (!window.top || !window.self || window.top != window.self);
        }
    },

    gaEvent: function(category, action, label)
    {
        swl_core.log("gaEvent [" + category + "] [" + action + "] [" + label + "]");

        _gaq.push(['b._trackEvent', category, action, label]);
    },

    initializeGoogleAnalytics: function()
    {
        swl_core.log("initializeGoogleAnalytics");

        if (document.getElementsByTagName('script').length == 0) return;

        try
        {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = 'https://ssl.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        }
        catch (ex)
        {
            swl_core.log(ex);
        }
    },

    insertSmileyUsingBHO: function(sid)
    {
        swl_core.log("insertSmileyUsingBHO");

        if (bhoSWLModule != null)
        {
            bhoSWLModule.insertSmiley(swl_core.buildSmileyLink(sid), sid);
        }
    },

    getGMailComposerDoc: function(source)
    {
        swl_core.log("getGMailComposerDoc");

        var composerDoc = undefined;

        // Look for the top level canvas frame
        var canvasFrames = SWL.$("#canvas_frame");
        if (canvasFrames.length != 0)
        {
            canvasFrames.each(function (index, canvasFrame)
            {
                // Look for the content doc
                var canvasDoc = canvasFrame.contentDocument;
                if (canvasDoc != undefined)
                {
                    // Get the embedded iframe
                    var frames = SWL.$(canvasDoc).find("iframe");
                    if (frames != undefined)
                    {
                        // Finally find the content doc
                        frames.each(function (index, frame)
                        {
                            if (frame.contentDocument != undefined)
                            {
                                composerDoc = frame.contentDocument;
                            };
                        });
                    }
                }
            });
        }
        else
        {
            canvasFrames = SWL.$("iframe.editable");
            // Finally find the content doc
            canvasFrames.each(function (index, frame)
            {
                if (frame.contentDocument != undefined)
                {
                    composerDoc = frame.contentDocument;
                    return;
                };
            });

            if (source)
            {
                if (source.parents("[role='main']").length > 0)
                {
                    canvasFrames = source.parents("[role='main']").find("div.editable iframe");
                }
                else if (source.parents("[role='dialog']").length > 0)
                {
                    canvasFrames = source.parents("[role='dialog']").find("div.editable iframe");
                }
            }
            else
            {
                canvasFrames = SWL.$("div.editable iframe");
            }
            // Finally find the content doc
            canvasFrames.each(function (index, frame)
            {
                if (frame.contentDocument != undefined)
                {
                    composerDoc = frame.contentDocument;
                    return;
                };
            });
        }
        return composerDoc;
    },

    getHotmailComposerDoc: function()
    {
        swl_core.log("getHotmailComposerDoc");

        var composerDoc = undefined;

        // Look for iframe RichTextEditor_surface
        var composerFrames = SWL.$("iframe#RichTextEditor_surface,iframe#ComposeRteEditor_surface");
        // Finally find the content doc
        composerFrames.each(function (index, frame)
        {
            if (frame.contentDocument != undefined)
            {
                composerDoc = frame.contentDocument;
                return;
            };
        });
        if (composerDoc == null)
        {
            // Look for the top level app frame
            var appFrames = SWL.$("#appFrame");
            appFrames.each(function (index, appFrame)
            {
                // Look for the content doc
                var appDoc = appFrame.contentDocument;
                if (appDoc != undefined)
                {
                    // Get the embedded iframe
                    var frames = SWL.$(appDoc).find("iframe");
                    if (frames != undefined)
                    {
                        // Finally find the content doc
                        frames.each(function (index, frame)
                        {
                            try
                            {
                                if (frame.id == "contentFrame")
                                {
                                    var contentDoc = frame.contentDocument;
                                    if (contentDoc != undefined)
                                    {
                                        var contentIFrames = SWL.$(contentDoc).find("iframe");
                                        contentIFrames.each(function (index, contentFrame)
                                        {
                                            try
                                            {
                                                if (contentFrame.contentDocument != undefined && contentFrame.id == "RichTextEditor_surface")
                                                {
                                                    composerDoc = contentFrame.contentDocument;
                                                };
                                            }
                                            catch (ex)
                                            {
                                            }
                                        });
                                    }
                                }
                                else if (frame.contentDocument != undefined && frame.id == "RichTextEditor_surface")
                                {
                                    composerDoc = frame.contentDocument;
                                };
                            }
                            catch (ex)
                            {
                            }
                        });
                    }
                }
            });
        }
        return composerDoc;
    },

    getYahooComposerDoc: function()
    {
        swl_core.log("getYahooComposerDoc");

        var composerDoc = undefined;

        // Find the compose-message div
        var composeDivs = SWL.$("div.compose-message");
        if (composeDivs != undefined)
        {
            composeDivs.each(function (index, div)
            {
                // Look for the iframe
                var frames = SWL.$(div).find("iframe");
                if (frames != undefined)
                {
                    // Finally find the content doc
                    frames.each(function (index, frame)
                    {
                        if (frame.contentDocument != undefined)
                        {
                            composerDoc = frame.contentDocument;
                        };
                    });
                }
            });
        }
        return composerDoc;
    },

    getTumblrComposerDoc: function()
    {
        swl_core.log("getTumblrComposerDoc");

        var composerDoc = undefined;

        // Look for the iframe
        var frames = !swl_core.isIE() ? SWL.$("#post_content iframe") : SWL.$("#content iframe");
        if (frames.length > 0)
        {
            if (frames[0].contentDocument != undefined)
            {
                composerDoc = frames[0].contentDocument;
            };
        }
        return composerDoc;
    },

    getGooglePlusStatusBox: function()
    {
        swl_core.log("getGooglePlusStatusBox");

        var sharebox = SWL.$("[guidedhelpid='sharebox']");
        var input = sharebox.find("[g_editable='true']");
        if (input.length == 0 || !input.is(":focus"))
        {
            var button = sharebox.find("[role='button']");
            if (button != undefined)
            {
                button.focus();
                input = sharebox.find("[g_editable='true']");
            }
        }
        return input;
    },

    getFacebookStatusBox: function()
    {
        swl_core.log("getFacebookStatusBox");

        if (window.location.pathname.indexOf("/messages/") != -1)
        {
            var messagesTextarea = SWL.$(".-cx-PRIVATE-webMessengerComposer__composerTextarea,textarea[aria-controls='webMessengerRecentMessages']");
            if (messagesTextarea.length > 0)
            {
                return messagesTextarea[0];
            }
        }
        else
        {
            var statusBox = SWL.$("#pagelet_composer textarea.mentionsTextarea");
            if (statusBox.length > 0)
            {
                return statusBox[0];
            }
        }
    },

    getTwitterStatusBox: function()
    {
        swl_core.log("getTwitterStatusBox");

        return SWL.$("textarea.tweet-box,div.tweet-box[contenteditable='true']");
    },

    insertAtCaret: function (target, myValue)
    {
        swl_core.log("insertAtCaret");

        return target.each(function (i)
        {
            if (document.selection)
            {
                //For browsers like Internet Explorer
                this.focus();
                sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
            }
            else if (this.selectionStart || this.selectionStart == '0')
            {
                //For browsers like Firefox and Webkit based
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
                this.focus();
                this.selectionStart = startPos + myValue.length;
                this.selectionEnd = startPos + myValue.length;
                this.scrollTop = scrollTop;
            } else
            {
                this.value += myValue;
                this.focus();
            }
        });
    },


    insertTextIntoInputArea: function (inputArea, text)
    {
        swl_core.log("insertTextIntoInputArea");

        if (!inputArea.is(":focus"))
        {
            inputArea.focus();
        }

        var node = swl_core.insertHtmlAtCursor(text);

        window.setTimeout(function ()
        {
            inputArea.resize();
            if (node != undefined)
            {
                try
                {
                    node.scrollIntoView(false);
                }
                catch (ex)
                {}
            }
        }, 500);
    },

    insertHtmlAtCursor: function (html)
    {
        swl_core.log("insertHtmlAtCursor");

        var node;
        if (window.getSelection && window.getSelection().getRangeAt)
        {
            // Get current range and selection
            var selection = window.getSelection();
            var range = selection.getRangeAt(0);
            // Delete the contents if any
            range.deleteContents();
            // Create the html node
            try
            {
                node = SWL.$(html)[0];
            }
            catch (ex)
            {
                node = document.createTextNode(html);
            }
            // Insert it to the range
            range.insertNode(node);
            // Set the range to past the new node
            range.setStartAfter(node);
            range.setEndAfter(node);
            // Move the cursor to past the new node
            selection.removeAllRanges();
            selection.addRange(range);
            selection.collapseToEnd();
        }
        else if (document.selection && document.selection.createRange)
        {
            // XXX Path not tested
            var range = document.selection.createRange();
            range.pasteHTML(html);
        }
        return node;
    },

    cancelEvent: function (e)
    {
        swl_core.log("cancelEvent");

        if (!e)
        {
            e = window.event;
        }

        if (e.preventDefault)
        {
            e.preventDefault();
        }
        else
        {
            e.returnValue = false;
        }
        return false;
    },

    unselectable: function (target)
    {
        swl_core.log("unselectable");

        var unselect = function (trgt)
        {
            if (trgt)
            {
                SWL.$(trgt).attr("unselectable", "on");
                trgt.onmousedown = function (event)
                {
                    return swl_core.cancelEvent(event);
                };
            }
        };
        unselect(target);
        target.find("*").each(function (index, element)
        {
            unselect(element);
        });
    },

    // Insert smiley to email msg composer
    insertSmileyToMsgComposer: function (composerDoc, sid)
    {
        swl_core.log("insertSmileyToMsgComposer");

        swl_core.insertHtmlToDocument(composerDoc, swl_core.buildSmileyLink(sid));
    },

    triggerSpaceKeyPress: function(target)
    {
        swl_core.log("triggerSpaceKeyPress");

        swl_core.triggerKeyboardEvent(target, "keydown", 32);
        swl_core.triggerKeyboardEvent(target, "keyup", 32);
        swl_core.triggerKeyboardEvent(target, "keypress", 32);
    },

    // Insert smiley to the target text area
    insertSmileysToTextarea: function (targetTextarea, smileyText)
    {
        swl_core.log("insertSmileysToTextarea");

        targetTextarea.focus();

        swl_core.triggerSpaceKeyPress(targetTextarea);

        window.setTimeout(function()
        {
            var textarea = SWL.$(targetTextarea);
            swl_core.insertAtCaret(textarea, smileyText);
        }, 100);
    },

    // Insert smiley to the target editable div
    insertSmileysToEditableDiv: function (targetEditableDiv, smileyText)
    {
        swl_core.log("insertSmileysToEditableDiv");

        targetEditableDiv.focus();

        swl_core.triggerSpaceKeyPress(targetEditableDiv);

        swl_core.insertHtmlAtCursor(smileyText + " ");

        swl_core.triggerSpaceKeyPress(targetEditableDiv);
    },

    postToFacebookFeedUrl: function(linkUrl, imageUrl)
    {
        var feedUrl = "https://www.facebook.com/dialog/feed?";
        feedUrl += "app_id=" + swl_core.facebookAppId + "&";
        feedUrl += "link=" + linkUrl.split("?")[0] + "&";
        feedUrl += "picture=" + imageUrl.split("?")[0] + "&";
        feedUrl += "name=Smileys%20We%20Love&";
        feedUrl += "description=Use%20Smileys%20We%20Love%20to%20add%20flare%20to%20your%20posts.&";
        feedUrl += "redirect_uri=http://facebook.com";

        return feedUrl;
    },

    postToFacebookFeed: function (linkUrl, imageUrl)
    {
        swl_core.log("postToFacebookFeed");

        var feedUrl = swl_core.postToFacebookFeedUrl(linkUrl, imageUrl);

        if (swl_core.isMozilla())
        {
            content.wrappedJSObject.location = feedUrl;
        }
        else
        {
            window.location = feedUrl;
        }
    },

    // Build a smiley link html
    buildSmileyLink: function (sid)
    {
        swl_core.log("buildSmileyLink");

        var linkUrl = swl_core.baseurl + "/" + sid;
        var imageUrl = swl_core.baseurl + "/smiley/img/" + sid;

        if (swl_core.isMozilla())
        {
            return '<img src="' + imageUrl + '"/>';
        }
        else
        {
            return '<a href="' + linkUrl + '"><img src="' + imageUrl + '"/></a>';
        }
    },

    // Insert html to the Document
    insertHtmlToDocument: function (doc, html)
    {
        swl_core.log("insertHtmlToDocument");

        if (doc != undefined)
        {
            doc.body.focus();
            doc.execCommand("insertHTML", false, html);
            doc.body.focus();
        }
    },

    // Limit the amount of resize events we fire for fast typing.
    limitedResize: function (input)
    {
        swl_core.log("limitedResize");

        if (swl_core.inLimitedResize) return true;

        swl_core.inLimitedResize = true;

        window.setTimeout(function()
        {
            input.resize();
            swl_core.inLimitedResize = false;
        }, 1000);
    },

    findFixedPosition: function(elem)
    {
        var left = 0;
        var top = 0;
        if (elem.offsetParent)
        {
            do
            {
                left += elem.offsetLeft;
                top += elem.offsetTop;
            }
            while (elem = elem.offsetParent);
        }
        return { left: left, top: top - SWL.$(window).scrollTop() };
    },

    createInputArea: function (id)
    {
        swl_core.log("createInputArea");

        var inputId = 'swl_ChatInput' + id;

        var swlInputWrapper = SWL.$(document.createElement("div")).addClass("swl_ChatInputWrapper");
        var swlInput = SWL.$(document.createElement("div")).addClass("swl_ChatInput");
        swlInput.attr({
            contentEditable: "true",
            id: inputId
        });
        if (swl_core.isMozilla())
        {
            swlInput.css("text-align", "-moz-left");
        }
        swlInputWrapper.append(swlInput);

        return swlInputWrapper;
    },

    createToolbar: function (id, originalInputContainer, placement)
    {
        swl_core.log("createToolbar");

        var toolbarId = 'swl_toolbar' + id;
        var toolbarSmileyButtonId = 'swl_button' + id;
        var toolbarAboutButtonId = 'swl_about_button' + id;

        // Create toolbar container
        var toolbarContainer = SWL.$(document.createElement("div")).addClass("swl_chatContainer");
        toolbarContainer.attr("id", "swl_toolbarContainer");

        if (!placement)
        {
            originalInputContainer.before(toolbarContainer);
        }
        else if (placement == "prepend")
        {
            originalInputContainer.prepend(toolbarContainer);
        }
        else if (placement == "append")
        {
            originalInputContainer.append(toolbarContainer);
        }
        else
        {
            originalInputContainer.after(toolbarContainer);
        }

        // Create toolbar and append it to the toolbar container
        var swlToolbar = SWL.$(document.createElement("div")).addClass("swl_Toolbar");
        swlToolbar.attr({
            id: toolbarId
        });
        SWL.$(swlToolbar).appendTo(toolbarContainer);

        var swlSmileyButton = SWL.$(document.createElement("div")).addClass("swl_ToolbarButton swl_SmileyToolbarButton");
        swlSmileyButton.attr({
            id: toolbarSmileyButtonId
        });
        swlToolbar.append(swlSmileyButton);

        var swlAboutButton = SWL.$(document.createElement("div")).addClass("swl_ToolbarLogo").html("About");
        swlAboutButton.attr({
            id: toolbarAboutButtonId
        });
        swlToolbar.append(swlAboutButton);

        var swlHideButton = SWL.$(document.createElement("div")).addClass("swl_hideToolbarButton").html("Hide");
        swlHideButton.attr("title", "Hide all smileyswelove toolbars.");
        swlToolbar.append(swlHideButton);

        swl_core.unselectable(toolbarContainer);

        return swlToolbar;
    },

    createAboutDialog: function ()
    {
        swl_core.log("createAboutDialog");

        // Create the about dialog and then add in the components
        var aboutDialog = SWL.$(document.createElement("div")).addClass("swl_AboutDialog");
        aboutDialog.attr("id", "swl_AboutDialog");

        var closeButton = SWL.$(document.createElement("div")).addClass("swl_AboutDialogCloseButton");
        aboutDialog.append(closeButton);

        var logo = SWL.$(document.createElement("div")).addClass("swl_AboutDialogLogo");
        aboutDialog.append(logo);

        var body = SWL.$(document.createElement("div")).addClass("swl_AboutDialogBody");
        body.html("<p>Smileys We Love</p><p>Copyright 2012 Squeeky Chocolate, LLC</p><p>All rights reserved.</p>");
        aboutDialog.append(body);

        return aboutDialog;
    },

    closeAboutDialog: function (aboutDialog)
    {
        swl_core.log("closeAboutDialog");

        if (aboutDialog == undefined) return;

        aboutDialog.remove();
    },

    createPopupDialog: function ()
    {
        swl_core.log("createPopupDialog");

        popupDialog = SWL.$(document.createElement("div")).addClass("swl_chatSmileyPopup");
        popupDialog.attr("id", "swl_popup");

        var popupPlaceholder = SWL.$("#swl_chatPopupPlaceholder");
        popupDialog.html(popupPlaceholder.find("#swl_page").html());

        var closeButton = SWL.$(document.createElement("div")).addClass("swl_chatSmileyPopupCloseButton");
        popupDialog.append(closeButton);

        return popupDialog;
    },

    closePopupDialog: function (popupDialog)
    {
        swl_core.log("closePopupDialog");

        if (popupDialog == undefined) return;

        popupDialog.remove();

        swl_core.forceHideOverlay();
    },

    requestSmileyPopup: function (source)
    {
        swl_core.log("requestSmileyPopup");

        // Local file so load synchronously
        swl_core.smileyChatPopupRequest.open("GET", chrome.extension.getURL("smileys.htm"), false);
        swl_core.smileyChatPopupRequest.send(null);

        return swl_core.smileyChatPopupRequest.responseText;
    },

    requestSmileys: function (sendresponse)
    {
        swl_core.log("requestSmileys");

        if (_SWLSmileyPackages)
        {
            return;
        }
        // Local file so load synchronously
        swl_core.smileyJSRequest.open("GET", chrome.extension.getURL("swl_smileys.js"), false);
        swl_core.smileyJSRequest.send(null);

        var response = swl_core.smileyJSRequest.responseText;
        response = response.replace("var _SWLSmileyPackages = ", "");
        _SWLSmileyPackages = SWL.$.parseJSON(response);
    },

    findSmileyInfo: function (sid)
    {
        swl_core.log("findSmileyInfo");

        if (_SWLSmileyPackages == undefined)
        {
            return;
        }

        for (var package in _SWLSmileyPackages)
        {
            if (package == "Recent") continue;

            var smileys = _SWLSmileyPackages[package]["images"];
            for (var i = 0; i < smileys.length; i++)
            {
                if (smileys[i].sid == sid)
                {
                    return smileys[i];
                }
            }
        }
    },

    isFavorite: function (sid)
    {
        swl_core.log("isFavorite");

        if (_SWLSmileyPackages == undefined)
        {
            return false;
        }

        var favorites = _SWLSmileyPackages["Favorites"];

        if (!favorites)
        {
            return false;
        }

        var smileys = favorites["images"];
        for (var i = 0; i < smileys.length; i++)
        {
            if (smileys[i].sid == sid)
            {
                return true;
            }
        }
        return false;
    },

    updateSpecialPackages: function()
    {
        swl_core.log("updateSpecialPackages");

        // Add the extended empty text here as the json become invalid from being put on the page as html element.
        try
        {
            var json = SWL.$("#swl_mySmileys").html();
            var mySmileys = typeof (json_parse) != 'undefined' ? json_parse(json) : JSON.parse(json);
            if (mySmileys)
            {
                mySmileys.emptyText += swl_core.mySmileysExtendedEmptyText;
                swl_core.updateSpecialSmileyPackage(mySmileys);
            }
        }
        catch (ex)
        {}

        try
        {
            var json = SWL.$("#swl_favorites").html();
            var favorites = typeof (json_parse) != 'undefined' ? json_parse(json) : JSON.parse(json);
            if (favorites)
            {
                //favorites.emptyText += swl_core.favoritesExtendedEmptyText;
                swl_core.updateSpecialSmileyPackage(favorites);
            }
        }
        catch (ex)
        {}

        try
        {
            // Update recent smileys last after any other special package
            var json = SWL.$("#swl_recentSmileys").html();
            swl_core.updateSpecialSmileyPackage(typeof (json_parse) != 'undefined' ? json_parse(json) : JSON.parse(json));
        }
        catch (ex)
        {}
    },

    updateSmileyPackageInfo: function (package)
    {
        swl_core.log("updateSmileyPackageInfo");

        if (_SWLSmileyPackages == undefined)
        {
            return;
        }

        var smileys = package["images"];

        if (smileys == undefined) return;

        for (var i = 0; i < smileys.length; i++)
        {
            if (smileys[i].filename == undefined)
            {
                var smileyInfo = swl_core.findSmileyInfo(smileys[i].sid);
                if (smileyInfo != undefined)
                {
                    smileys[i] = smileyInfo;
                }
            }
        }
    },

    updateSpecialSmileyPackage: function (package)
    {
        swl_core.log("updateSpecialSmileyPackage");

        if (_SWLSmileyPackages == undefined || package == null || package == undefined)
        {
            return;
        }

        swl_core.updateSmileyPackageInfo(package);

        _SWLSmileyPackages[package.title] = package;
    },

    useLazyload: function ()
    {
        return !!(SWL.$.fn.lazyload != undefined);
    },

    insertSmileyPackages: function (parentNode, supportRecent, supportMySmileys, supportFavorites)
    {
        swl_core.log("insertSmileyPackages");

        try
        {
            if (_SWLSmileyPackages == undefined || parentNode.find(".swl_menu").length > 0) return;

            if (!supportRecent)
            {
                supportRecent = SWL.$("#swl_recentSmileys").length > 0;
            }
            if (!supportMySmileys)
            {
                supportMySmileys = SWL.$("#swl_mySmileys").length > 0;
            }
            if (!supportFavorites)
            {
                supportFavorites = SWL.$("#swl_favorites").length > 0;
            }

            // Insert our special packages first
            var swl_menu;
            if (supportRecent)
            {
                swl_menu = SWL.$(document.createElement("div")).addClass("swl_menu");
                swl_menu.attr({
                    tag: "Recent"
                });
                swl_menu.html("Recent");

                parentNode.append(swl_menu);
            }

            if (supportFavorites)
            {
                swl_menu = SWL.$(document.createElement("div")).addClass("swl_menu");
                swl_menu.attr({
                    tag: "Favorites"
                });
                swl_menu.html("Favorites");

                parentNode.append(swl_menu);
            }

            if (supportMySmileys)
            {
                swl_menu = SWL.$(document.createElement("div")).addClass("swl_menu");
                swl_menu.attr({
                    tag: "My Smileys"
                });
                swl_menu.html("My Smileys");

                parentNode.append(swl_menu);
            }

            for (var package in _SWLSmileyPackages)
            {
                if (package == "Recent" || package == "My Smileys" || package == "Favorites") continue;

                swl_menu = SWL.$(document.createElement("div")).addClass("swl_menu");
                swl_menu.attr({
                    tag: package
                });
                swl_menu.html(package);

                parentNode.append(swl_menu);
            }
        }
        catch (ex)
        {
            swl_core.log(ex);
        }
    },

    insertSmileyPackage: function (parentNode, packageName, protocol)
    {
        swl_core.log("insertSmileyPackage");

        try
        {
            if (_SWLSmileyPackages == undefined)
            {
                return;
            }

            var package = _SWLSmileyPackages[packageName];

            if (package == undefined) return;

            var lazy = swl_core.useLazyload();
            var smileyRoot = "//s3.amazonaws.com/emoticons.smileyswelove.com/smileys/";
            var lazyPlaceholderImage = "//smileyswelove.com/extension/loading.gif";

            if (protocol)
            {
                smileyRoot = protocol + smileyRoot;
                lazyPlaceholderImage = protocol + lazyPlaceholderImage;
            }

            // Hide existing packages
            parentNode.find(".swl_package").hide();

            var swl_package = parentNode.find("div#" + packageName);
            if (!package.forceReload && swl_package.length > 0)
            {
                swl_package.show();
                return;
            }
            swl_package.remove();

            // Create the package div
            swl_package = SWL.$(document.createElement("div")).addClass("swl_package");
            swl_package.attr({
                id: packageName
            });

            // Create and add all the smileys to the package div
            var smileys = package["images"];

            if ((smileys == undefined || smileys.length == 0 || package.showEmptyTextAlways == true) && package.emptyText != undefined)
            {
                swl_package.append(package.emptyText);
            }
            else
            {
                swl_package.html("");
            }

            for (var i = 0; i < smileys.length; i++)
            {
                var smiley = smileys[i];

                var filename = smiley.filename;
                var thumbnail = smiley.thumbnail;

                if (filename == undefined)
                {
                    filename = "//smileyswelove.com/smiley/img/" + smiley.sid;
                }
                else
                {
                    var rootPath = package.rootPath ? package.rootPath : (smiley.rootPath ? smiley.rootPath : smileyRoot);

                    // Only add rootpath if filename is not a full url
                    if (filename.indexOf("://") == -1)
                    {
                        filename = rootPath + filename;
                    }
                    if (thumbnail && thumbnail.indexOf("://") == -1)
                    {
                        thumbnail = rootPath + thumbnail;
                    }
                }
                var swl_smiley = SWL.$(document.createElement("div")).addClass("swl_smiley");
                var swl_smileyimg = SWL.$(document.createElement("img")).addClass("swl_smileyimg");

                if (lazy == undefined || lazy == false)
                {
                    swl_smileyimg.attr({
                        src: thumbnail ? thumbnail : filename,
                        sid: smiley.sid
                    });
                }
                else
                {
                    swl_smileyimg.attr({
                        src: lazyPlaceholderImage,
                        sid: smiley.sid
                    });
                    swl_smileyimg.attr("data-original", thumbnail ? thumbnail : filename);
                }

                if (swl_core.isIE())
                {
                    // IE doesn't reset the height and width
                    swl_smileyimg.removeAttr('width');
                    swl_smileyimg.removeAttr('height');
                }

                if (thumbnail)
                {
                    swl_smileyimg.attr("data-fullimage", filename);
                }

                //swl_smiley.append(swl_smileyOverlay);

                swl_smiley.append(swl_smileyimg);

                swl_package.append(swl_smiley);
            }

            // Insert new package
            parentNode.append(swl_package);

            if (lazy)
            {
                window.setTimeout(function()
                {
                    swl_core.fadeSmileysIn();
                }, 500);
            }
            return;
        }
        catch (ex)
        {
            console.log(ex);
        }
        try
        {
            // Old method with smileys already present on the page
            parentNode.html(SWL.$("#" + packageName)[0].cloneNode(true));
        }
        catch (ex)
        {
            console.log(ex);
        }
    },

    fadeSmileysIn: function ()
    {
        SWL.$("img.swl_smileyimg").lazyload({
            container: SWL.$(swl_core.lazyLoaderContainer),
            event: "scrollstop",
            effect: "fadeIn"
        });
    },

    buildSmileyText: function (sid)
    {
        return swl_core.smileyConfigurations[0].prefix + sid + "/" + swl_core.smileyConfigurations[0].postfix;
    },

    buildNonLinkSmileyText: function (sid)
    {
        return swl_core.smileyNonLinkConfigurations[0].prefix + sid + "/" + swl_core.smileyNonLinkConfigurations[0].postfix;
    },

    buildSmileyImageText: function (sid)
    {
        return "<img class=\"swl_inputSmileyImg\" align=\"textBottom\" src=\"http://smileyswelove.com/smiley/img/" + sid + "/\" sid=\"" + sid + "\">";
    },

    buildSmileyImageLink: function (sid)
    {
        return "http://smileyswelove.com/smiley/img/" + sid;
    },

    buildSmileyLinkUrl: function (sid)
    {
        return swl_core.baseurl + "/" + sid;
    },

    replaceInputSmileys: function (input, textarea)
    {
        //swl_core.log("replaceInputSmileys");

        if (input.length == 0) return;

        var text = "";
        for (var i = 0; i < input[0].childNodes.length; i++)
        {
            var node = input[0].childNodes[i];
            if (node.className != "swl_inputSmileyImg")
            {
                text += node.textContent;
                continue;
            }
            var sid = SWL.$(node).attr("sid");
            var smileyText = swl_core.buildSmileyText(sid);
            text += smileyText;
        }

        // Update actual textbox with the updated text
        SWL.$(textarea).val(text);
    },

    // Replace smiley texts in the given log element
    replaceSmileyTexts: function (element)
    {
        //swl_core.log("replaceSmileyTexts");

        var text = SWL.$(element).html();

        var smileyFound = false;

        swl_core.smileyConfigurations.forEach(function(config, index, array)
        {
            prefixNoUrl = config.prefixNoUrl;
            urlNoProtocol = config.urlNoProtocol;
            url = config.url;
            prefix = config.prefix;
            postfix = config.postfix;

            var prefixLen = prefix.length;
            var postfixLen = postfix.length;
            var urlLen = urlNoProtocol.length;

            var index = 0;
            // First find out smiley text prefix (ignoring url since that can be formatted by the IM when inserted)
            while ((index = text.indexOf(prefixNoUrl, index)) != -1)
            {
                // Find the postfix
                var index2 = text.indexOf(postfix, index);
                if (index2 == -1)
                {
                    index += prefixLen;
                    continue;
                }

                // Ok, now get the full smiley text
                var smileyText = text.substr(index, index2 - index + postfixLen);

                // Now look for the url with the image id and the closing /
                var imageIndex1 = smileyText.indexOf(urlNoProtocol);
                if (imageIndex1 == -1)
                {
                    index += prefixLen;
                    continue;
                }
                var imageIndex2 = smileyText.indexOf("/", imageIndex1 + urlLen);

                var packageIndex1 = imageIndex2 + 1;
                var packageIndex2 = smileyText.indexOf("/", packageIndex1);

                // Grab the image id substring
                var smileyId = smileyText.substr(imageIndex1 + urlLen, imageIndex2 - imageIndex1 - urlLen);

                // If smileyId is not a number, then try to find it from the end of smileyText
                if (parseInt(smileyId) != smileyId)
                {
                    imageIndex2 = smileyText.lastIndexOf("/");
                    // Now find the next non-number working back from imageIndex2
                    imageIndex1 = imageIndex2;
                    while (!isNaN(smileyText.substr(imageIndex1 - 1, 1)))
                    {
                        imageIndex1--;
                    }
                    smileyId = smileyText.substr(imageIndex1, imageIndex2 - imageIndex1);
                }

                if (parseInt(smileyId) != smileyId)
                {
                    // Not finding the smiley id, move along.
                    index += smileyElement.length;
                    continue;
                }

                var closingIndex = smileyId.indexOf('"');
                if (closingIndex != -1)
                {
                    smileyId = smileyId.substr(0, closingIndex);
                }

                // Grab the package id substring
                if (packageIndex2 != -1)
                {
                    var packageId = smileyText.substr(packageIndex1, packageIndex2 - packageIndex1);
                }

                var smileyPath = "http://smileyswelove.com/smiley/img/" + smileyId;

                var smileyElement = "<a href='" + url + smileyId + "' target='_blank' class='swl_smileyOutputLink'><img class='swl_smileyOutputImage' sid='" + smileyId + "' align='textBottom'  style='max-width:190px' src='" + smileyPath + "'></a>";

                // Replace that text with the smiley image element
                var originalText = text.substring(index, index2 + postfixLen);

                text = text.replace(originalText, smileyElement);

                // Move index to end of element
                index += smileyElement.length;

                smileyFound = true;
            }
        });
        if (smileyFound)
        {
            SWL.$(element).html(text);
        }
        return smileyFound;
    },

    // Replace non-link smiley texts in the given log element
    replaceNonLinkSmileyTexts: function (element)
    {
        //swl_core.log("replaceSmileyTexts");

        var text = SWL.$(element).html();

        var smileyFound = false;

        swl_core.smileyNonLinkConfigurations.forEach(function(config, index, array)
        {
            prefixNoUrl = config.prefixNoUrl;
            urlNoProtocol = config.urlNoProtocol;
            url = config.url;
            prefix = config.prefix;
            postfix = config.postfix;

            var prefixLen = prefix.length;
            var postfixLen = postfix.length;
            var urlLen = urlNoProtocol.length;

            var index = 0;
            // First find out smiley text prefix (ignoring url since that can be formatted by the IM when inserted)
            while ((index = text.indexOf(prefixNoUrl, index)) != -1)
            {
                // Find the postfix
                var index2 = text.indexOf(postfix, index);
                if (index2 == -1)
                {
                    index += prefixLen;
                    continue;
                }

                // Ok, now get the full smiley text
                var smileyText = text.substr(index, index2 - index + postfixLen);

                // Now look for the url with the image id and the closing /
                var imageIndex1 = smileyText.indexOf(urlNoProtocol);
                if (imageIndex1 == -1)
                {
                    index += prefixLen;
                    continue;
                }
                var imageIndex2 = smileyText.indexOf("/", imageIndex1 + urlLen);

                // Grab the image id substring
                var smileyId = smileyText.substr(imageIndex1 + urlLen, imageIndex2 - imageIndex1 - urlLen);

                var closingIndex = smileyId.indexOf('"');
                if (closingIndex != -1)
                {
                    smileyId = smileyId.substr(0, closingIndex);
                }

                var smileyPath = "http://smileyswelove.com/smiley/img/" + smileyId;

                var smileyElement = "<a href='" + url + smileyId + "' target='_blank' class='swl_smileyOutputLink'><img class='swl_smileyOutputImage' sid='" + smileyId + "' align='textBottom'  style='max-width:190px' src='" + smileyPath + "'></a>";

                // Replace that text with the smiley image element
                var originalText = text.substring(index, index2 + postfixLen);

                text = text.replace(originalText, smileyElement);

                // Move index to end of element
                index += smileyElement.length;

                smileyFound = true;
            }
        });
        if (smileyFound)
        {
            SWL.$(element).html(text);
        }
        return smileyFound;
    },

    showOverlay: function (event)
    {
        swl_core.log("showOverlay");

        var inPopup = event.target.className != "swl_smileyOutputImage";

        // Get the smiley div and smiley image
        var smiley = SWL.$(event.target);
        var smileyimg;
        if (inPopup)
        {
            smiley = event.target.className == "swl_smileyimg" ? smiley.parent() : smiley;
            smileyimg = smiley.find(".swl_smileyimg");
        }
        else
        {
            smileyimg = smiley;
        }

        // Check to make sure that the desired overlay is not already active
        var sid = smileyimg.attr("sid");
        if (swl_core.getOverlaySid() == sid)
        {
            return;
        }

        swl_core.updateSpecialPackages();

        // Remove existing active overlay if there is one
        SWL.$("#swl_overlay_active").remove();

        var smileyOutputLink = smileyimg.parent(".swl_smileyOutputLink");

        // Clone the img so we leave the original alone
        smileyimg = smileyimg.clone();

        // Remove 'lazy' loading if active.
        if (smileyimg.attr("data-original"))
        {
            smileyimg.attr("src", smileyimg.attr("data-original"));
        }

        // Get the correct overlay
        var overlay;
        if (inPopup)
        {
            // Set the overlay inside the popup
            var popup = smiley.parents("#swl_popup,#swl_page");
            overlay = popup.find("#swl_overlay").clone();
            overlay.attr("id","swl_overlay_active");
            popup.append(overlay);
        }
        else
        {
            // Move the overlay to top level so we can use it for output smileys
            overlay = SWL.$("#swl_overlay").clone();
            overlay.attr("id","swl_overlay_active");
            SWL.$("body").append(overlay);
        }
        overlay.attr("sid", sid);

        // Update the image
        var overlay_smiley = overlay.find("#swl_overlay_smiley");
        overlay_smiley.children().remove();
        if (smileyOutputLink.length > 0)
        {
            smileyOutputLink = smileyOutputLink.clone();
            smileyOutputLink.children().remove();
            smileyOutputLink.append(smileyimg);
            overlay_smiley.append(smileyOutputLink);
        }
        else
        {
            overlay_smiley.append(smileyimg);
        }
        // Position the overlay based on the div
        var size = smiley.outerWidth() + 40 > 138 ? smiley.outerWidth() + 40 : 138;
        if (inPopup)
        {
            var left = smiley[0].offsetLeft - 10;
            if (left + size > window.innerWidth - 25)
            {
                // Adjust position to account for 'end' of the window
                left = window.innerWidth - 25 - size;
            }
            var top = smiley[0].offsetTop - 10 - overlay.parent().find("#swl_right").scrollTop();
            if (top + size > overlay.parent().height() - 5)
            {
                // Adjust position to account for 'end' of the popup
                top = overlay.parent().height() - 5 - size;
            }
            overlay.css({ left: left, top: top });
        }
        else
        {
            var offset = smiley.offset();
            overlay.css({ left: offset.left - 10, top: offset.top - 10 });
        }

        overlay.width(size);
        overlay.height(size);

        swl_core.updateOverlayFavorite(sid);

        var overlay_share = overlay.find("#swl_overlay_share");
        overlay_share.css({ left: 0, top: smiley.outerHeight() > 96 ? smiley.outerHeight() : 96 });

        // Show the overlay
        overlay.show();
    },

    forceHideOverlay: function(event)
    {
        swl_core.hideOverlay(event, true);
    },

    hideOverlay: function(event, force)
    {
        if (!force && event && event.target && event.target.id != "swl_overlay_active") return;

        swl_core.log("hideOverlay");

        // Only hide the overlay if we are not hovering on top of the overlay
        var overlay = SWL.$("#swl_overlay_active");
        if (!force && overlay.length > 0 && overlay.is(":hover"))
        {
            swl_core.log("still hovering");
            return;
        }
        overlay.remove();
    },

    updateOverlayFavorite: function(sid)
    {
        swl_core.log("updateOverlayFavorite");

        var overlay_favorites = SWL.$("#swl_overlay_active #swl_overlay_favorites");

        var isFavorite = swl_core.isFavorite(sid);
        if (isFavorite)
        {
            overlay_favorites.find("#swl_overlay_favorite").show();
            overlay_favorites.find("#swl_overlay_add_favorite").hide();
        }
        else
        {
            overlay_favorites.find("#swl_overlay_favorite").hide();
            overlay_favorites.find("#swl_overlay_add_favorite").show();
        }
    },

    getOverlaySid: function()
    {
        swl_core.log("getOverlaySid");

        return SWL.$("#swl_overlay_active").attr("sid");
    },

    isLoggedIn: function()
    {
        if (SWL.$("#swl_loggedIn").length > 0)
        {
            return SWL.$("#swl_loggedIn").html() == "true";
        }
        return false;
    },

    scriptExists: function (url, doc)
    {
        swl_core.log("scriptExists");

        if (!doc)
        {
            doc = document;
        }

        var scripts = document.getElementsByTagName('script');
        for (var i = scripts.length; i >= 0; i--)
        {
            if (scripts[i] != undefined && scripts[i].src == url)
            {
                return true;
            }
        }
        return false;
    },

    stylesheetExists: function (url)
    {
        swl_core.log("stylesheetExists");

        var links = document.getElementsByTagName('link');
        for (var i = links.length; i >= 0; i--)
        {
            if (links[i] != undefined && links[i].getAttribute("href") == url)
            {
                return true;
            }
        }
        return false;
    },

    insertScript: function (url, doc, async, body, intoBody)
    {
        swl_core.log("insertScript");

        if (swl_core.scriptExists(url, doc)) return;

        if (!doc)
        {
            doc = document;
        }
        var script = doc.createElement("script");
        script.type = "text/javascript";
        if (url)
        {
            script.src = url;
        }
        if (async)
        {
            script.async = true;
        }
        if (body)
        {
            script.innerHTML = body;
        }
        if (!intoBody)
        {
            doc.getElementsByTagName("head")[0].appendChild(script);
        }
        else
        {
            doc.getElementsByTagName("body")[0].appendChild(script);
        }
    },

    insertStylesheet: function (url, doc)
    {
        swl_core.log("insertStylesheet");

        if (!doc)
        {
            doc = document;
        }
        var css = doc.createElement("link");
        css.setAttribute("rel", "stylesheet");
        css.setAttribute("type", "text/css");
        css.setAttribute("href", url);
        doc.getElementsByTagName("head")[0].appendChild(css);
    },

    savedRange: undefined,

    saveSelection: function ()
    {
        swl_core.log("saveSelection");

        if (window.getSelection) //non IE Browsers
        {
            swl_core.savedRange = window.getSelection().getRangeAt(0);
        }
        else if (document.selection) //IE
        {
            swl_core.savedRange = document.selection.createRange();
        }
    },

    restoreSelection: function (input)
    {
        swl_core.log("restoreSelection");

        input.focus();

        if (swl_core.savedRange != null)
        {
            if (window.getSelection)//non IE and there is already a selection
            {
                var s = window.getSelection();
                if (s.rangeCount > 0)
                {
                    s.removeAllRanges();
                }
                s.addRange(swl_core.savedRange);
            }
            else if (document.createRange)//non IE and no selection
            {
                window.getSelection().addRange(swl_core.savedRange);
            }
            else if (document.selection)//IE
            {
                swl_core.savedRange.select();
            }
        }
    },

    removeQueryString: function (url)
    {
        swl_core.log("removeQueryString");

        var queryIndex = url.indexOf("?");
        if (queryIndex != -1)
        {
            url = url.substr(0, queryIndex);
        }
        return url;
    },

    triggerKeyboardEvent: function (target, type, keyCode)
    {
        swl_core.log("triggerKeyboardEvent");

        var eventObj =  document.createEvent ? document.createEvent("Events") : document.createEventObject();
        if (eventObj.initEvent)
        {
            eventObj.initEvent(type, true, true);
        }

        eventObj.keyCode = keyCode;
        eventObj.which = keyCode;

        target.dispatchEvent ? target.dispatchEvent(eventObj) : target.fireEvent("on" + type, eventObj);
    },

    dispatchKeyEvent: function (target, event)
    {
        swl_core.log("dispatchKeyEvent");

        var eventType = event ? event.type : null;
        if (eventType && typeof eventType === "string")
        {
            eventType = eventType.toLowerCase();
            switch (eventType)
            {
                case "keyup":
                case "keydown":
                case "keypress":
                    break;
                default:
                    return false;
            }
        }
        else
        {
            return false;
        }

        var targetEvent = null;
        var result = false;

        if (SWL.$.isFunction(document.createEvent))
        {
            try
            {
                targetEvent = document.createEvent("KeyEvents");
                targetEvent.initKeyEvent(event.type, event.bubbles, event.cancelable, event.view, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.keyCode, event.charCode);
            }
            catch (ex1)
            {
                try
                {
                    targetEvent = document.createEvent("Events");
                }
                catch (ex2)
                {
                    targetEvent = document.createEvent("UIEvents");
                }
                finally
                {
                    targetEvent.initEvent(event.type, event.bubbles, event.cancelable);
                    targetEvent.view = event.view;
                    targetEvent.altKey = event.altKey;
                    targetEvent.ctrlKey = event.ctrlKey;
                    targetEvent.shiftKey = event.shiftKey;
                    targetEvent.metaKey = event.metaKey;
                    targetEvent.keyCode = event.keyCode;
                    targetEvent.charCode = event.charCode
                    targetEvent.which = event.which;
                }
            }
            var c = target.dispatchEvent(targetEvent);

            result = true;
        }
        else if (document.createEventObject && typeof document.createEventObject === "object")
        {
            targetEvent = document.createEventObject();
            targetEvent.bubbles = event.bubbles;
            targetEvent.cancelable = event.cancelable;
            targetEvent.view = event.view;
            targetEvent.ctrlKey = event.ctrlKey;
            targetEvent.altKey = event.altKey;
            targetEvent.shiftKey = event.shiftKey;
            targetEvent.metaKey = event.metaKey;
            targetEvent.keyCode = event.keyCode;
            targetEvent.which = event.which;

            target.fireEvent("on" + event.type, targetEvent);

            result = true;
        }
        return result;
    }
};

// Google analytics
var _gaq = _gaq || [];
_gaq.push(['b._setAccount', 'UA-10005312-17']);

swl_core.initializeGoogleAnalytics();