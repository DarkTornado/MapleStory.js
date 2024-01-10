const axios = require('axios');

function MapleStory(key) {
    this.key = key;
    this.nickName = null;
    this.ocid = null;
};

MapleStory.prototype = {};
MapleStory.prototype.init = async function(nickName) {
    this.nickName = nickName;
    const url = 'https://open.api.nexon.com/maplestory/v1/id?character_name=' + nickName;
    try {
        const response = await axios.get(url, {
            headers: {
                'accept': 'application/json',
                'x-nxopen-api-key': this.key
            }
        });
        this.ocid = response.data.ocid;
    } catch (e) {
        //임시
        // throw 'Cannot find charater that has name ' + nickName;
        console.log(e);
    }
};
MapleStory.prototype.getBasicInfo = async function() {
    const url = 'https://open.api.nexon.com//maplestory/v1/character/basic?ocid=' + this.ocid + '&date=' + getDate();
    const response = await axios.get(url, {
        headers: {
            'accept': 'application/json',
            'x-nxopen-api-key': this.key
        }
    });
    const data = response.data;
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
MapleStory.prototype.getStatus = async function() {
    const url = 'https://open.api.nexon.com//maplestory/v1/character/stat?ocid=' + this.ocid + '&date=' + getDate();
    const response = await axios.get(url, {
        headers: {
            'accept': 'application/json',
            'x-nxopen-api-key': this.key
        }
    });
    const data = response.data.final_stat;
    const result = [];
    data.forEach((e, i) => {
        result[i] = {
            name: e.stat_name,
            value: e.stat_value
        };
    });
    return result;
};
MapleStory.prototype.getBeauty = async function() {
    const url = 'https://open.api.nexon.com//maplestory/v1/character/beauty-equipment?ocid=' + this.ocid + '&date=' + getDate();
    const response = await axios.get(url, {
        headers: {
            'accept': 'application/json',
            'x-nxopen-api-key': this.key
        }
    });
    const data = response.data;
    const hair = data.character_hair.hair_name.split(' ');
    hair.shift();
    const result = {
        hair: {
            name: hair.join(' ')
        },
        face: {
            name: data.character_face.face_name
        },
        skin: data.character_skin_name
    };
    if (data.character_hair.mix_color == null) {
        result.hair.isMix = false;
        result.hair.color = data.character_hair.base_color;
    } else {
        result.hair.isMix = true;
        result.hair.color = [
            {
                color: data.character_hair.base_color,
                rate: 100 - parseInt(data.character_hair.mix_rate)
            }, {
                color: data.character_hair.mix_color,
                rate: parseInt(data.character_hair.mix_rate)
            }
        ];
    }
    if (data.character_face.mix_color == null) {
        result.face.isMix = false;
        result.face.color = data.character_face.base_color;
    } else {
        result.face.isMix = true;
        result.face.color = [
            {
                color: data.character_face.base_color,
                rate: 100 - parseInt(data.character_face.mix_rate)
            }, {
                color: data.character_face.mix_color,
                rate: parseInt(data.character_face.mix_rate)
            }
        ];
    }
    return result;
};

function getDate() {
    process.env.TZ = 'Asia/Seoul';
    var now = new Date(Date.now() - 24 * 60 * 60 * 1000);
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    if (m < 10) m = '0' + m;
    if (d < 10) d = '0' + d;
    return y + '-' + m + '-' + d;
}

module.exports = MapleStory;
