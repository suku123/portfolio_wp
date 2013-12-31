
var swl_base =
{
    test: false,
    logging: false,
    chatInputIdCount: 0,
    mappedChatWindows: [],
    aboutDialog: undefined,
    popupDialog: undefined,
    currentMenu: "smileys",
    currentToolbar: undefined,
    swl_inputTimer: undefined,
    swl_outputTimer: undefined,

    // Override this in the super class
    config:
    {
        // Settings
        name: "swl_base",
        loggingName: "swl_base",
        supportInput: true,
        supportOutput: false,
        useShortSmileyText: false,
        useNonLinkSmileyText: false,

        // Functions
        isSupportedSite: undefined,
        setPopupLocation: undefined,
        setAboutLocation: undefined,
        popupShownEvent: undefined,
        showDialogsAboveToolbar: undefined,
        showDialogsToLeftToolbar: undefined,
        getSmileyClickedTarget: undefined,
        sendOnEnter: undefined,

        // Event handlers
        onUpdateOutput: undefined,
        onUpdateInput: undefined,
        onSmileyClicked: undefined
    },

    log: function (msg)
    {
        if (swl_base.logging)
        {
            console.log("[" + swl_base.config.loggingName + "] " + msg);
        }
    },

    gaEvent: function(action, label)
    {
        swl_core.gaEvent(swl_base.config.name, action, label);
    },

    isSupportedSite: function()
    {
        if (!swl_base.config.isSupportedSite) return false;

        return swl_base.config.isSupportedSite();
    },

    initializeListeners: function ()
    {
        if (!swl_base.isSupportedSite()) return;

        swl_base.log("initializeListeners");

        var body = SWL.$("body");

        body.on("click", ".swl_ToolbarButton", swl_base.onShowPopupDialog);
        body.on("click", ".swl_ToolbarLogo", swl_base.onShowAboutDialog);
        body.on("click", ".swl_AboutDialogCloseButton", swl_base.onCloseAboutDialog);
        body.on("click", ".swl_chatSmileyPopupCloseButton", swl_base.onClosePopupDialog);

        // Register to listen to all smiley image clicks
        body.on("click", ".swl_smiley,#swl_overlay_smiley", swl_base.onSmileyDivClicked);
        body.on("click", ".swl_smileyimg", swl_base.onSmileyClicked);
        body.on("click", "#swl_login", swl_base.onLoginLinkClicked);
        body.on("click", "#swl_logout", swl_base.onLogoutLinkClicked);

        body.on("mouseleave", "#swl_overlay_active", swl_core.hideOverlay);

        if (swl_core.isIE())
        {
            body.on("mousewheel", "#swl_overlay_active", function(e)
            {
                swl_core.forceHideOverlay(e);

                var scrollTo = (e.originalEvent.wheelDelta * -1) + SWL.$('#swl_right').scrollTop();
                SWL.$("#swl_right").scrollTop(scrollTo);
            });
        }

        body.on("click", "#swl_overlay_favorite", swl_base.onAddFavoriteClicked);
        body.on("click", "#swl_overlay_add_favorite", swl_base.onAddFavoriteClicked);
        body.on("click", "#swl_overlay_fb", swl_base.onOverlayFacebookClicked);
        body.on("click", "#swl_overlay_gplus", swl_base.onOverlayGooglePlusClicked);
        body.on("click", "#swl_overlay_twitter", swl_base.onOverlayTwitterClicked);

        swl_base.initialize();
    },

    initialize: function ()
    {
        if (!swl_base.isSupportedSite()) return;

        swl_base.log("initialize");

        if (swl_base.config.supportOutput)
        {
            // Timer to look for smiley texts in the chat output window(s).
            if (swl_base.swl_outputTimer != undefined)
            {
                window.clearInterval(swl_base.swl_outputTimer);
            }
            swl_base.swl_outputTimer = window.setInterval(function()
            {
                swl_base.onUpdateOutput();
            }, 1000);
        }

        if (swl_base.config.supportInput)
        {
            // Find chat textarea and replace with one that supports images
            if (swl_base.swl_inputTimer != undefined)
            {
                window.clearInterval(swl_base.swl_inputTimer);
            }
            swl_base.swl_inputTimer = window.setInterval(function()
            {
                swl_base.onUpdateInput();
            }, 1000);
        }
    },

    smileyClicked: function (img)
    {
        // See if the entire smiley clicked event is being handled
        if (swl_base.config.onSmileyClicked)
        {
            return swl_base.config.onSmileyClicked(img);
        }

        // Otherwise, let's just ask for the target
        if (!swl_base.config.getSmileyClickedTarget) return;

        // Get the input target
        var inputArea = swl_base.config.getSmileyClickedTarget();
        if (inputArea.length > 1)
        {
            inputArea = SWL.$(inputArea[0]);
        }

        var sid = SWL.$(img).attr("sid");

        swl_base.gaEvent("SmileyClicked", swl_base.config.name + " smiley clicked with sid=" + sid);

        var smiley;
        if (swl_base.config.useShortSmileyText)
        {
            smiley = swl_core.getShortPrefix() + sid + "/ #smiley" + swl_core.getShortPostfix();
        }
        else if (swl_base.config.useNonLinkSmileyText)
        {
            smiley = swl_core.buildNonLinkSmileyText(sid);
        }
        else
        {
            smiley = swl_core.buildSmileyText(sid);
        }

        if (!inputArea.is(":focus"))
        {
            inputArea.focus();
        }

        window.setTimeout(function()
        {
            if (inputArea.attr("contenteditable") == "true")
            {
                if (swl_core.isIE())
                {
                    swl_core.triggerSpaceKeyPress(inputArea[0]);
                    window.setTimeout(function()
                    {
                        swl_core.insertTextIntoInputArea(inputArea, smiley);
                    }, 100);
                }
                else
                {
                    swl_core.insertTextIntoInputArea(inputArea, smiley);
                }
            }
            else
            {
                swl_core.insertAtCaret(inputArea, smiley);
            }
        }, 300);

        swl_base.closePopupDialog();
    },

    onSmileyDivClicked: function (event)
    {
        var img = SWL.$(event.target).children()[0];

        if (img == undefined) return;

        swl_base.smileyClicked(img);

        if (!swl_core.isIE())
        {
            event.stopPropagation();
        }
    },

    onSmileyClicked: function (event)
    {
        swl_base.smileyClicked(event.target);

        if (!swl_core.isIE())
        {
            event.stopPropagation();
        }
    },

    showDialogsAboveToolbar: function()
    {
        if (swl_base.config.showDialogsAboveToolbar)
        {
            return swl_base.config.showDialogsAboveToolbar();
        }
        return false; // Show below by default
    },

    showDialogsToLeftToolbar: function()
    {
        if (swl_base.config.showDialogsToLeftToolbar)
        {
            return swl_base.config.showDialogsToLeftToolbar();
        }
        return false; // Show to the right by default
    },

    setAboutLocation: function(event)
    {
        if (swl_base.config.setAboutLocation)
        {
            // Override the whole implementation
            return swl_base.config.setAboutLocation(event);
        }
        // Default implementation
        var fixedPosition = swl_base.currentToolbar.parent().offset();

        var left = fixedPosition.left + swl_base.currentToolbar.parent().width() - swl_base.aboutDialog.width();
        var top  = fixedPosition.top + swl_base.currentToolbar.parent().height();
        if (swl_base.showDialogsAboveToolbar())
        {
            top  = fixedPosition.top - swl_base.aboutDialog.height();
        }
        if (left < 0)
        {
            left = 0;
        }
        swl_base.aboutDialog.css("left", left + "px");
        swl_base.aboutDialog.css("top", top + "px");
    },

    onShowAboutDialog: function (event)
    {
        swl_base.closePopupDialog();
        swl_base.closeAboutDialog();

        var target = SWL.$(event.target);

        swl_base.currentToolbar = target;

        swl_base.aboutDialog = swl_core.createAboutDialog()

        SWL.$("body").append(swl_base.aboutDialog);

        SWL.$("div").on("scroll", swl_base.setAboutLocation);

        // Place the popup
        swl_base.setAboutLocation();
    },

    onCloseAboutDialog: function (event)
    {
        swl_base.closeAboutDialog();
    },

    closeAboutDialog: function()
    {
        swl_base.log("closeAboutDialog");

        swl_core.closeAboutDialog(swl_base.aboutDialog);

        SWL.$("div").off("scroll", swl_base.setAboutLocation);
    },

    setPopupLocation: function(event)
    {
        if (swl_base.config.setPopupLocation)
        {
            return swl_base.config.setPopupLocation(event);
        }
        // Default implementation
        var fixedPosition = swl_base.currentToolbar.parent().offset();

        var left = fixedPosition.left;
        var top  = fixedPosition.top + swl_base.currentToolbar.parent().height();
        if (swl_base.showDialogsAboveToolbar())
        {
            top  = fixedPosition.top - swl_base.popupDialog.height();
        }
        if (swl_base.showDialogsToLeftToolbar())
        {
            left  = fixedPosition.left - swl_base.popupDialog.width() + swl_base.currentToolbar.width() + 6;
        }
        if (top < 0)
        {
            top = 0;
        }

        var desiredWidth = swl_base.popupDialog.width();
        var desiredHeight = swl_base.popupDialog.height();
        var actualWidth = swl_base.popupDialog.width();
        var actualHeight = swl_base.popupDialog.height();

        if (swl_base.popupDialog.width() + left > window.innerWidth)
        {
            left = 0;
            actualWidth = window.innerWidth - 10;
            swl_base.popupDialog.css("width", actualWidth + "px");
            swl_base.popupDialog.find("#swl_right").css("width", actualWidth - 90 + "px");
        }
        if (swl_base.popupDialog.height() > window.innerHeight - 20)
        {
            top = 0;
            actualHeight =  window.innerHeight - top - 20;
            swl_base.popupDialog.css("height", actualHeight + "px");
        }
        if (top < 0)
        {
            top = 0;
        }
        if (left < 0)
        {
            left = 0;
        }
        swl_base.popupDialog.css("left", left + "px");
        swl_base.popupDialog.css("top", top + "px");

        if (desiredHeight > actualHeight || desiredWidth > actualWidth)
        {
            // Use 'minimized' style
            swl_base.popupDialog.find(".swl_logo").css("display", "none");
            swl_base.popupDialog.find("#swl_intro").css("display", "none");
            swl_base.popupDialog.find("#swl_bottom").css("display", "none");
            swl_base.popupDialog.find("hr:first").css("margin-top", "30px");
            swl_base.popupDialog.find("hr:last").css("display", "none");
            swl_base.popupDialog.css("height",  "320px");
            if (swl_base.showDialogsAboveToolbar())
            {
                top  = fixedPosition.top - 320;
                if (top < 0)
                {
                    top = 0;
                }
                swl_base.popupDialog.css("top", top + "px");
            }
        }
    },

    popupShownEvent: function()
    {
        if (swl_base.config.popupShownEvent)
        {
            return swl_base.config.popupShownEvent();
        }
        swl_base.gaEvent("ChatPopupShown");
    },

    onShowPopupDialog: function (event)
    {
        swl_base.log("onShowPopupDialog");

        var target = SWL.$(event.target);

        swl_base.currentToolbar = target;

        swl_base.closePopupDialog();
        swl_base.closeAboutDialog();

        swl_base.popupDialog = swl_core.createPopupDialog();

        // Some style updates to avoid css version conflicts
        swl_base.popupDialog.attr({
            style: "width:510px;left:0px;top:25px;z-index:999;"
        });

        var swl_right = swl_base.popupDialog.find("#swl_right");
        swl_right.attr({
            style: "overflow-y:scroll;width:415px;height:260px;"
        });

        // Add packages
        var swl_left = swl_base.popupDialog.find("#swl_left");
        swl_core.insertSmileyPackages(swl_left, true, true, true);

        swl_core.unselectable(swl_base.popupDialog);

        // Insert the popup dialog
        SWL.$("body").append(swl_base.popupDialog);

        SWL.$("div").on("scroll", swl_base.setPopupLocation);

        SWL.$(".swl_menu").click(swl_base.onSwitchMenu);

        // Place the popup
        swl_base.setPopupLocation();

        swl_base.popupShownEvent();

        // Give us some time to get the smileys
        window.setTimeout(function()
        {
            swl_base.switchMenu(swl_right);
        }, 1000);
    },

    onClosePopupDialog: function (event)
    {
        swl_base.closePopupDialog();
    },

    closePopupDialog: function()
    {
        swl_base.log("closePopupDialog");

        swl_core.closePopupDialog(swl_base.popupDialog);

        SWL.$("div").off("scroll", swl_base.setPopupLocation);
    },

    onSwitchMenu: function ()
    {
        var menu = SWL.$(this);
        swl_base.currentMenu = menu.attr("tag");
        var swl_right = menu.parents(".swl_chatSmileyPopup").find("#swl_right");
        swl_right.scrollTop(0);

        swl_base.switchMenu(swl_right);
    },

    switchMenu: function (swl_right)
    {
        swl_base.log("switchMenu");

        var isLoggedIn = swl_core.isLoggedIn();

        swl_right.parent().find("#swl_login").css("display", isLoggedIn ? "none" : "block");
        swl_right.parent().find("#swl_logout").css("display", isLoggedIn ? "block" : "none");

        if (swl_base.currentMenu == undefined)
        {
            swl_base.currentMenu = SWL.$("#swl_left").find(".swl_menu").first().attr("tag");
        }

        // Remove currently selected menu and highlight the newly selected menu
        SWL.$(".swl_currentMenu").removeClass("swl_currentMenu");
        SWL.$(".swl_menu[tag='" + swl_base.currentMenu + "']").addClass("swl_currentMenu");

        swl_core.updateSpecialPackages();

        swl_core.insertSmileyPackage(swl_right, swl_base.currentMenu);

        // Update smiley images and overlay to make sure we can fit at least two columns
        if (swl_right.width() < 218)
        {
            var divSize = (swl_right.width() - 46) / 2;
            var imgSize = divSize - 4;
            swl_right.find(".swl_smiley").css("width", divSize + "px")
            swl_right.find(".swl_smiley").css("height", divSize + "px")
            swl_right.find(".swl_smileyimg").css("width", imgSize + "px")
            swl_right.find(".swl_smileyimg").css("height", imgSize + "px")
        }

        // Overwrite interesting css values we are 'accidentally' inheriting
        swl_right.find("i").css("background-image", "none");

        SWL.$(".swl_smiley").hoverIntent(
            {
                over: swl_core.showOverlay,
                out: swl_core.hideOverlay,
                interval: 400
            });
    },

    // Update all the chat output windows
    onUpdateOutput: function ()
    {
        if (!swl_base.config.onUpdateOutput) return;

        swl_base.config.onUpdateOutput();

        // Attach to new output images but only if the overlay is not currently shown
        var overlay = SWL.$("#swl_overlay_active");
        if (overlay.length == 0 || overlay.is(":hover") == false)
        {
            SWL.$(".swl_smileyOutputImage").hoverIntent(
                {
                    over: swl_core.showOverlay,
                    out: swl_core.hideOverlay,
                    interval: 500
                });
        }
    },

    onUpdateInput: function ()
    {
        if (SWL.$("#swl_chatPopupPlaceholder").length == 0) return;

        if (!swl_base.config.onUpdateInput) return;

        swl_base.config.onUpdateInput();
    },

    onLoginLinkClicked: function (event)
    {
        swl_base.closePopupDialog();

        window.open(swl_core.baseurl + "/account/logon");

        return false;
    },

    onLogoutLinkClicked: function (event)
    {
        swl_base.closePopupDialog();

        SWL.$("#swl_loggedIn").html("");
    },

    onOverlayFacebookClicked: function (event)
    {
        swl_base.gaEvent("Overlay to FB");
    },

    onOverlayGooglePlusClicked: function (event)
    {
        swl_base.gaEvent("Overlay to Google+");
    },

    onOverlayTwitterClicked: function (event)
    {
        swl_base.gaEvent("Overlay to Twitter");
    },

    onShowFavoritesClicked: function(event)
    {
        swl_base.currentMenu = "Favorites";
        swl_base.switchMenu(SWL.$(event.target).parents(".swl_chatSmileyPopup").find("#swl_right"));

        swl_core.hideOverlay();
    },

    onAddFavoriteClicked: function(event)
    {
        swl_base.gaEvent("Overlay add favorite");

        if (!swl_core.isLoggedIn())
        {
            swl_base.currentMenu = "Favorites";
            swl_base.switchMenu(SWL.$(event.target).parents(".swl_chatSmileyPopup").find("#swl_right"));

            swl_core.hideOverlay();
        }
    },

    sendOnEnter: function (element)
    {
        if (swl_base.config.sendOnEnter)
        {
            return swl_base.config.sendOnEnter(element);
        }
        return true;
    },

    onChatInputKeyEvent: function (event)
    {
        swl_base.log("onChatInputKeyEvent");

        var input = SWL.$(this);

        var textarea = swl_base.getTextarea(input);

        if (event.type == "keydown"|| event.type == "keypress")
        {
            if (event.which == 13 && !event.shiftKey && swl_base.sendOnEnter(input))
            {
                swl_core.replaceInputSmileys(input, textarea);
            }
            if (textarea)
            {
                swl_core.dispatchKeyEvent(SWL.$(textarea)[0], event);

                if (event.which == 13 && !event.shiftKey && swl_base.sendOnEnter(input))
                {
                    // Now clear the text from our input area
                    input.html(SWL.$.browser.mozilla ? "<br/>" : "");
                    input.focus();
                    input.resize();
                    return false;
                }
            }
        }
        else if (event.type == "keyup")
        {
            if (textarea)
            {
                SWL.$(textarea).val("..");
                swl_core.dispatchKeyEvent(SWL.$(textarea)[0], event);
            }
        }
        swl_core.limitedResize(input);
    },

    getTextarea: function (input)
    {
        swl_base.log("getTextarea");

        var id = input.attr('id');
        id = id.replace("swl_ChatInput", "");

        var mappings = swl_base.mappedChatWindows[id];
        if (mappings == undefined)
        {
            swl_base.log("mappings not found");
            return;
        }
        return mappings[0];
    }
};

// Save history in a global variable to avoid our override from being potentially garbage collected.
// For more details see https://bugzilla.mozilla.org/show_bug.cgi?id=593910. For the pushstate override,
// see http://felix-kling.de/blog/2011/01/06/how-to-detect-history-pushstate/.
var savedHistory = window.history;

var pushState = savedHistory.pushState;
savedHistory.pushState = function(state)
{
    if (typeof savedHistory.onpushstate == "function")
    {
        savedHistory.onpushstate({state: state});
    }
    // ... whatever else you want to do
    // maybe call onhashchange e.handler
    return pushState.apply(savedHistory, arguments);
};

window.onpopstate = savedHistory.onpushstate = function (event)
{
    swl_base.initialize();
};


