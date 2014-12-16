function collapseHTree() {
    $("#inheritance").addClass("collapsed");
    $("#hierarchyTree").css("height", "0px");
    $.cookie("collapse_hierarchy_tree", "y");
}

$(document).ready(function () {
    var savedHierarchyHeight = $("#hierarchyTree").outerHeight();

    var cht = $.cookie("collapse_hierarchy_tree");
    if (cht && cht === "y")
        collapseHTree();

    $("#inheritance h6").click(function() {
        if ($("#inheritance").hasClass("collapsed")) {
            $("#inheritance").removeClass("collapsed");
            $("#hierarchyTree").css("height", savedHierarchyHeight + "px");
            $.cookie("collapse_hierarchy_tree", "n");
        }
        else {
            collapseHTree();
        }
    });

    $("#inheritance").css("visibility", "visible");

    /*$("#visXMLAttrs").click(function() {
        if ( $("#visXMLAttrs").hasClass("active") ) {
            $("#xmlBlob span.isInheritedAttribute").each(function() {
                $(this).css({"display": "none"});
            });
        }
        else {
            $("#xmlBlob span.isInheritedAttribute").each(function() {
                $(this).css({"display": "block"});
            });
        }   
    });*/
    
    $('#tabbable a:first').tab('show');
    liveUpdate("#live_search_toc", "#sidebar");
    var lastSearchVal = "";
    $("#live_search_toc").keyup(function() {
        var searchVal = $(this).val();
        if (searchVal !== lastSearchVal) {
            $.cookie("search_val", searchVal);
            lastSearchVal = searchVal;
        }
    });

    $('span.methodClicker, article.article, h3.methodClicker').each(function () {
        var a = $(this);
        var constructorPos = a.attr("id").indexOf("new ");

        var objName = a.attr("id");
        if (constructorPos >= 0) {
            objName = objName.substring(constructorPos + 4);
            objName += ".new";
        }

        a.attr("id", objName);
    });

    var savedSearchVal = $.cookie("search_val");
    if (savedSearchVal) {
        $("#live_search_toc").val(savedSearchVal);
        $("#live_search_toc").keyup();
    }
});

function liveUpdate(search_element, list) {
    search_element = jQuery(search_element);
    list = jQuery(list);

    if (list.length) {
        var rows = list.find('li'),
            cache = rows.map(function() {
                return this.innerHTML.toLowerCase();
            });

        search_element.keyup(filter).keyup().parents('form').submit(function() {
            return false;
        });
    }

    return search_element;

    function filter() {
        var term = jQuery.trim(jQuery(this).val().toLowerCase()),
            scores = [];

        $("#sidebar h3").show();
        if (!term) {
            rows.show();
            $("#no_search_results").css({
                display: "none",
                opacity : "0"
            });
        }
        else {
            rows.hide();

            cache.each(function(i) {
                var score = this.score(term);
                if (score > 0.5) {
                    scores.push([score, i]);
                }
            });

            if (scores.length) {
                $("#no_search_results").css({
                    display: "none",
                    opacity : "0"
                });
            }
            jQuery.each(scores.sort(function(a, b) {
                return b[0] - a[0];
            }), function() {
                jQuery(rows[this[1]]).show();
            });

            $("#sidebar h3").each(function(i) {
                if ($(this).find("li:visible").length === 0) {
                    $(this).hide();
                }
                else {
                    $(this).show();
                }
            });

            if ($("#sidebar h3:visible").length === 0) {
                $("#no_search_results").css("display", "block");
                setTimeout(function() {
                    $("#no_search_results").css("opacity", "1");
                });
            }
        }
    }
}

function scrollTo(el, data) {
    if (!data) {
        data = el.getAttribute("data-id");
        location.hash = data;
    }
    var el = $("span#" + data.replace(/\./g, "\\."))[0];
    if (!el) return;

    var article = $(el).closest('.article')[0];

    var top = article.offsetTop - 500;

    if (document.body.scrollTop > top || document.body.scrollTop != top && document.body.scrollTop + (window.innerHeight || document.documentElement.offsetHeight) < top + article.offsetHeight) {
        $('body').animate({
            scrollTop: top
        }, {
            duration: 200,
            easing: "swing"
        });
    }
}