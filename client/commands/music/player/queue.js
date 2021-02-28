module.exports = class queue {
    constructor(gid, client) {
        this.songs = [];
        this.np = {track: "", title: "", channel: "", length: 0, requester: "", url: "", date: 0};
        this.prev = [];
        this.vskip = [];
        this.vskipto = [];
        this.vprev = [];
        this.vdel = [];
        client.queue[gid] = this;
    }
}