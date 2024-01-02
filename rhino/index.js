function MapleStory(key) {
    this.key = key;
    this.nickName = null;
    this.ocid = null;
};

MapleStory.prototype = {};
MapleStory.prototype.init = function(nickName) {
    this.nickName = nickName;
    const url = 'https://open.api.nexon.com/maplestory/v1/id';
    var data = new HttpRequest(url)
        .header('accept', 'application/json')
        .header('x-nxopen-api-key', this.key)
        .data('character_name', nickName)
        .get();
    data = JSON.parse(data);
    this.ocid = data.ocid;
};
MapleStory.prototype.getCharInfo = function() {
    const url = 'https://open.api.nexon.com//maplestory/v1/character/basic';
    var data = new HttpRequest(url)
        .header('accept', 'application/json')
        .header('x-nxopen-api-key', this.key)
        .data('ocid', this.ocid)
        .data('date', getDate())
        .get();
    data = JSON.parse(data);
    const worlds = ['머야 왜', '0부터 시작 안함?', '리부트2', '리부트', //굳이 동일한 이미지가 두 개 올라가있음
        '오로라', '레드', '이노시스', '유니온', '스카니아', '루나', 
        '제니스', '크로아', '베라', '엘리시움', '아케인', '노바', 
        '버닝', '버닝2', '버닝3', '버닝4'];     //여기도 이미지 4개 올림
    return {
        name: data.character_name,
        world: data.world_name,
        worldIcon: 'https://ssl.nexon.com/s2/game/maplestory/renewal/common/world_icon/icon_' + worlds.indexOf(data.world_name) + '.png',
        level: data.character_level,
        exp: data.character_exp,
        expRate: data.character_exp_rate,
        gender: data.character_gender,
        class: data.character_class,
        classLevel: data.character_class_level,
        guild: data.character_guild_name,
        image: data.character_image,
        ocid: this.ocid
    };
};

function getDate() {
    var now = new Date(Date.now() - 24 * 60 * 60 * 1000);
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    if (m < 10) m = '0' + m;
    if (d < 10) d = '0' + d;
    return y + '-' + m + '-' + d;
}

function HttpRequest(url) {
    this.url = url;
    this.headers = {};
    this.params = [];
};
HttpRequest.prototype = {};
HttpRequest.prototype.header = function(key, value) {
    this.headers[key] = value;
    return this;
};
HttpRequest.prototype.data = function(key, value) {
    this.params.push(key + '=' + value);
    return this;
};
HttpRequest.prototype.get = function() {
    try {
        var url = new java.net.URL(this.params.length == 0 ? this.url : this.url + '?' + this.params.join('&'));
        var con = url.openConnection();
        if (con != null) {
            con.setConnectTimeout(5000);
            con.setUseCaches(false);
            for (var key in this.headers) {
                con.setRequestProperty(key, this.headers[key]);
            }
            var isr = new java.io.InputStreamReader(con.getInputStream());
            var br = new java.io.BufferedReader(isr);
            var str = br.readLine();
            var line = "";
            while ((line = br.readLine()) != null) {
                str += "\n" + line;
            }
            isr.close();
            br.close();
            con.disconnect();
        }
        return str.toString();
    } catch (e) {
        Log.e(e);
        return null;
    }
};

module.exports = MapleStory;