import { expect } from 'chai'
import ArtifactFile from '../src/ArtifactFile'


describe('ArtifactFile', function() {
    describe('setFilename', function() {
        it('should set filename', function() {
            const newFileObj = new ArtifactFile()
            const fileName = 'myFileName.txt'
            newFileObj.setFilename(fileName)
            expect(newFileObj.file.fname).eql(fileName)
        })
    })
    describe('getFilename', function() {
        it('should get filename', function() {
            const newFileObj = new ArtifactFile()
            const fileName = 'myFileName.txt'
            newFileObj.setFilename(fileName)
            expect(newFileObj.getFilename()).eql(fileName)
        })
    })
    describe('setDisplayName', function() {
        it('should set filename', function() {
            const newFileObj = new ArtifactFile()
            const fileName = 'myFileName.txt'
            newFileObj.setDisplayName(fileName)
            expect(newFileObj.file.dname).eql(fileName)
        })
    })
    describe('getDisplayName', function() {
        it('should get filename', function() {
            const newFileObj = new ArtifactFile()
            const fileName = 'myFileName.txt'
            newFileObj.setDisplayName(fileName)
            expect(newFileObj.getDisplayName()).eql(fileName)
        })
        it('should should get filename if display name is undefined', function() {
            const newFileObj = new ArtifactFile()
            const fileName = 'myFileName.txt'
            newFileObj.setFilename(fileName)
            expect(newFileObj.getDisplayName()).eql(fileName)
        })
        it('should should get filename if display name is empty', function() {
            const newFileObj = new ArtifactFile()
            const fileName = 'myFileName.txt'
            newFileObj.setFilename(fileName)
            newFileObj.setDisplayName('')
            expect(newFileObj.getDisplayName()).eql(fileName)
        })
    })
    describe('setDuration', function() {
        it('should set duration', function() {
            const newFileObj = new ArtifactFile()
            const duration = 10
            newFileObj.setDuration(duration)
            expect(newFileObj.file.duration).eql(duration)
        })
        it('should not fail if duration is NaN and return whatever was there before', function() {
            const newFileObj = new ArtifactFile()
            const duration = NaN
            newFileObj.setDuration(duration)
            expect(newFileObj.file.duration).is.undefined
        })
    })
    describe('getDuration', function() {
        it('should get file\'s duration', function() {
            const newFileObj = new ArtifactFile()
            const duration = 10
            newFileObj.setDuration(duration)
            expect(newFileObj.getDuration()).eql(duration)
        })
    })
    describe('setType', function() {
        it('should set file\'s type', function() {
            const newFileObj = new ArtifactFile()
            const type = 'Image'
            newFileObj.setType(type)
            expect(newFileObj.file.type).eql(type)
        })
        it('all file types have only the first letter capitalized', function() {
            const newFileObj = new ArtifactFile()
            const type = 'imaGe'
            const typeFixed = 'Image'
            newFileObj.setType(type)
            expect(newFileObj.file.type).eql(typeFixed)
        })
    })
    describe('getType', function() {
        it('should get file\'s type', function() {
            const newFileObj = new ArtifactFile()
            const type = 'Image'
            newFileObj.setType(type)
            expect(newFileObj.getType()).eql(type)
        })
    })
    describe('setSubtype', function() {
        it('should set file\'s type', function() {
            const newFileObj = new ArtifactFile()
            const subtype = 'Somesubtype'
            newFileObj.setSubtype(subtype)
            expect(newFileObj.file.subtype).eql(subtype)
        })
        it('if Subtype is set to \`cover\` then set it to \`Thumbnail\`', function() {
            const newFileObj = new ArtifactFile()
            const subtype = 'cover'
            const expectedSubtype = 'Thumbnail'
            newFileObj.setSubtype(subtype)
            expect(newFileObj.file.subtype).eql(expectedSubtype)
        })
        it('all file subtypes have only the first letter capitalized', function() {
            const newFileObj = new ArtifactFile()
            const subtype = 'someSubType'
            const subtypeFixed = 'Somesubtype'
            newFileObj.setSubtype(subtype)
            expect(newFileObj.file.subtype).eql(subtypeFixed)
        })
    })
    describe('getSubtype', function() {
        it('should get file\'s Subtype', function() {
            const newFileObj = new ArtifactFile()
            const subtype = 'Somesubtype'
            newFileObj.setSubtype(subtype)
            expect(newFileObj.getSubtype()).eql(subtype)
        })
    })
    describe('setFilesize', function() {
        it('should set Filesize', function() {
            const newFileObj = new ArtifactFile()
            const Filesize = 10
            newFileObj.setFilesize(Filesize)
            expect(newFileObj.file.fsize).eql(Filesize)
        })
    })
    describe('getFilesize', function() {
        it('should get Filesize', function() {
            const newFileObj = new ArtifactFile()
            const Filesize = 10
            newFileObj.setFilesize(Filesize)
            expect(newFileObj.getFilesize()).eql(Filesize)
        })
    })
    describe('setContentType', function() {
        it('should set ContentType', function() {
            const newFileObj = new ArtifactFile()
            const ContentType = 'music'
            newFileObj.setContentType(ContentType)
            expect(newFileObj.file.ctype).eql(ContentType)
        })
    })
    describe('getContentType', function() {
        it('should get ContentType', function() {
            const newFileObj = new ArtifactFile()
            const ContentType = 'music'
            newFileObj.setContentType(ContentType)
            expect(newFileObj.getContentType()).eql(ContentType)
        })
    })
    describe('setFileNotes', function() {
        it('should set FileNotes', function() {
            const newFileObj = new ArtifactFile()
            const FileNotes = 'This file is awesome'
            newFileObj.setFileNotes(FileNotes)
            expect(newFileObj.file.fnotes).eql(FileNotes)
        })
    })
    describe('getFileNotes', function() {
        it('should get FileNotes', function() {
            const newFileObj = new ArtifactFile()
            const FileNotes = 'This file is awesome'
            newFileObj.setFileNotes(FileNotes)
            expect(newFileObj.getFileNotes()).eql(FileNotes)
        })
    })
    describe('setSoftware', function() {
        it('should set Software', function() {
            const newFileObj = new ArtifactFile()
            const Software = 'notepad++'
            newFileObj.setSoftware(Software)
            expect(newFileObj.file.software).eql(Software)
        })
    })
    describe('getSoftware', function() {
        it('should get Software', function() {
            const newFileObj = new ArtifactFile()
            const Software = 'notepad++'
            newFileObj.setSoftware(Software)
            expect(newFileObj.getSoftware()).eql(Software)
        })
    })
    describe('setNetwork', function() {
        it('should set Network', function() {
            const newFileObj = new ArtifactFile()
            const Network = 'whatNetWork'
            newFileObj.setNetwork(Network)
            expect(newFileObj.file.network).eql(Network)
        })
    })
    describe('getNetwork', function() {
        it('should get Network', function() {
            const newFileObj = new ArtifactFile()
            const Network = 'whatNetWork'
            newFileObj.setNetwork(Network)
            expect(newFileObj.getNetwork()).eql(Network)
        })
    })
    describe('setLocation', function() {
        it('should set Location', function() {
            const newFileObj = new ArtifactFile()
            const Location = 'QmYeUctEPcGN8cdCixTE2eCMBRnue6CgCc6Brvu4rN1Lix'
            newFileObj.setLocation(Location)
            expect(newFileObj.file.location).eql(Location)
        })
    })
    describe('getLocation', function() {
        it('should get Location', function() {
            const newFileObj = new ArtifactFile()
            const Location = 'QmYeUctEPcGN8cdCixTE2eCMBRnue6CgCc6Brvu4rN1Lix'
            newFileObj.setLocation(Location)
            expect(newFileObj.getLocation()).eql(Location)
        })
    })
    describe('setSuggestedPlayCost', function() {
        it('should set SuggestedPlayCost', function() {
            const newFileObj = new ArtifactFile()
            const SuggestedPlayCost = 10
            newFileObj.setSuggestedPlayCost(SuggestedPlayCost)
            expect(newFileObj.file.sugPlay).eql(SuggestedPlayCost)
        })
    })
    describe('getSuggestedPlayCost', function() {
        it('should get SuggestedPlayCost', function() {
            const newFileObj = new ArtifactFile()
            const SuggestedPlayCost = 10
            newFileObj.setSuggestedPlayCost(SuggestedPlayCost)
            expect(newFileObj.getSuggestedPlayCost()).eql(SuggestedPlayCost)
        })
    })
    describe('setSuggestedBuyCost', function() {
        it('should set SuggestedBuyCost', function() {
            const newFileObj = new ArtifactFile()
            const SuggestedBuyCost = 10
            newFileObj.setSuggestedBuyCost(SuggestedBuyCost)
            expect(newFileObj.file.sugBuy).eql(SuggestedBuyCost)
        })
    })
    describe('getSuggestedBuyCost', function() {
        it('should get SuggestedBuyCost', function() {
            const newFileObj = new ArtifactFile()
            const SuggestedBuyCost = 10
            newFileObj.setSuggestedBuyCost(SuggestedBuyCost)
            expect(newFileObj.getSuggestedBuyCost()).eql(SuggestedBuyCost)
        })
    })
    describe('setDisallowPlay', function() {
        it('should set DisallowPlay', function() {
            const newFileObj = new ArtifactFile()
            const DisallowPlay = true
            newFileObj.setDisallowPlay(DisallowPlay)
            expect(newFileObj.file.disPlay).to.be.true
        })
    })
    describe('getDisallowPlay', function() {
        it('should get DisallowPlay', function() {
            const newFileObj = new ArtifactFile()
            const DisallowPlay = true
            newFileObj.setDisallowPlay(DisallowPlay)
            expect(newFileObj.getDisallowPlay()).to.be.true
        })
        it('should get false if DisallowPlay is not set', function() {
            const newFileObj = new ArtifactFile()
            expect(newFileObj.getDisallowPlay()).to.be.false
        })
    })
    describe('setDisallowBuy', function() {
        it('should set DisallowBuy', function() {
            const newFileObj = new ArtifactFile()
            const DisallowBuy = true
            newFileObj.setDisallowBuy(DisallowBuy)
            expect(newFileObj.file.disBuy).to.be.true        })
    })
    describe('getDisallowBuy', function() {
        it('should get DisallowBuy', function() {
            const newFileObj = new ArtifactFile()
            const DisallowBuy = true
            newFileObj.setDisallowBuy(DisallowBuy)
            expect(newFileObj.getDisallowBuy()).to.be.true        })
        it('should get false if DisallowBuy is not set', function() {
            const newFileObj = new ArtifactFile()
            expect(newFileObj.getDisallowBuy()).to.be.false
        })
    })
    describe('isValid', function() {
        it('should return true if filename is set', function() {
            const newFileObj = new ArtifactFile()
            const fileName = 'myFileName.txt'
            newFileObj.setFilename(fileName)
            expect(newFileObj.isValid()).to.be.true
        })
        it('should return object with error if filename is NOT set', function() {
            const newFileObj = new ArtifactFile()
            expect(newFileObj.isValid()).eql({
                success: false,
                error: "No Filename!"
            })
        })
    })
    describe('isPaid', function() {
        it('should return true if suggestedPlayCost is set', function() {
            const newFileObj = new ArtifactFile()
            const SuggestedPlayCost = 10
            newFileObj.setSuggestedPlayCost(SuggestedPlayCost)
            expect(newFileObj.isPaid()).to.be.true
        })
        it('should return true if suggestedBuyCost is set', function() {
            const newFileObj = new ArtifactFile()
            const SuggestedBuyCost = 10
            newFileObj.setSuggestedBuyCost(SuggestedBuyCost)
            expect(newFileObj.isPaid()).to.be.true
        })
        it('should return false if none of suggestedBuyCost or suggestedPlayCost are set', function() {
            const newFileObj = new ArtifactFile()
            expect(newFileObj.isPaid()).to.be.false
        })
    })
    describe('toJSON', function() {
        it('should return JSON object with info', function() {
            const newFileObj = new ArtifactFile()
            const displayFileName = 'myDisplaydisplayFileName.txt'
            newFileObj.setDisplayName(displayFileName)
            const fileName = 'myFileName.txt'
            newFileObj.setFilename(fileName)
            const duration = 10
            newFileObj.setDuration(duration)
            const type = 'Image'
            newFileObj.setType(type)
            const subtype = 'Somesubtype'
            newFileObj.setSubtype(subtype)
            const Filesize = 10
            newFileObj.setFilesize(Filesize)
            const ContentType = 'music'
            newFileObj.setContentType(ContentType)
            const FileNotes = 'This file is awesome'
            newFileObj.setFileNotes(FileNotes)
            const Software = 'notepad++'
            newFileObj.setSoftware(Software)
            const Network = 'whatNetWork'
            newFileObj.setNetwork(Network)
            const Location = 'QmYeUctEPcGN8cdCixTE2eCMBRnue6CgCc6Brvu4rN1Lix'
            newFileObj.setLocation(Location)
            const SuggestedPlayCost = 10
            newFileObj.setSuggestedPlayCost(SuggestedPlayCost)
            const SuggestedBuyCost = 10
            newFileObj.setSuggestedBuyCost(SuggestedBuyCost)
            newFileObj.setDisallowBuy(true)
            newFileObj.setDisallowPlay(true)
            const expected = {
                fname: 'myFileName.txt',
                dname: 'myDisplaydisplayFileName.txt',
                duration: 10,
                type: 'Image',
                subtype: 'Somesubtype',
                fsize: 10,
                ctype: 'music',
                fnotes: 'This file is awesome',
                software: 'notepad++',
                network: 'whatNetWork',
                location: 'QmYeUctEPcGN8cdCixTE2eCMBRnue6CgCc6Brvu4rN1Lix',
                sugPlay: 10,
                sugBuy: 10,
                disPlay: true,
                disBuy: true
            }
            expect(newFileObj.toJSON()).eql(expected)
        })
    })
    describe('fromJSON', function() {
        it('should build a valid artifact from JSON object with info', function() {
            const newFileObj = new ArtifactFile()
            const inputJSON = {
                fname: 'myFileName.txt',
                dname: 'myDisplaydisplayFileName.txt',
                duration: 10,
                type: 'Image',
                subtype: 'Somesubtype',
                fsize: 10,
                ctype: 'music',
                fnotes: 'This file is awesome',
                software: 'notepad++',
                network: 'whatNetWork',
                location: 'QmYeUctEPcGN8cdCixTE2eCMBRnue6CgCc6Brvu4rN1Lix',
                sugPlay: 10,
                sugBuy: 10,
                disPlay: true,
                disBuy: true
            }
            newFileObj.fromJSON(inputJSON)
            expect(newFileObj.toJSON()).eql(inputJSON)
        })
        it('should also work with \`cType\` instead of \`ctype\`', function() {
            const newFileObj = new ArtifactFile()
            const inputJSON = {
                fname: 'myFileName.txt',
                dname: 'myDisplaydisplayFileName.txt',
                duration: 10,
                type: 'Image',
                subtype: 'Somesubtype',
                fsize: 10,
                cType: 'music',
                fnotes: 'This file is awesome',
                software: 'notepad++',
                network: 'whatNetWork',
                location: 'QmYeUctEPcGN8cdCixTE2eCMBRnue6CgCc6Brvu4rN1Lix',
                sugPlay: 10,
                sugBuy: 10,
                disPlay: true,
                disBuy: true
            }
            const expectedJSON = {
                fname: 'myFileName.txt',
                dname: 'myDisplaydisplayFileName.txt',
                duration: 10,
                type: 'Image',
                subtype: 'Somesubtype',
                fsize: 10,
                ctype: 'music',
                fnotes: 'This file is awesome',
                software: 'notepad++',
                network: 'whatNetWork',
                location: 'QmYeUctEPcGN8cdCixTE2eCMBRnue6CgCc6Brvu4rN1Lix',
                sugPlay: 10,
                sugBuy: 10,
                disPlay: true,
                disBuy: true
            }
            newFileObj.fromJSON(inputJSON)
            expect(newFileObj.toJSON()).eql(expectedJSON)
        })
        it('should also work with \`fNotes\` instead of \`fnotes\`', function() {
            const newFileObj = new ArtifactFile()
            const inputJSON = {
                fname: 'myFileName.txt',
                dname: 'myDisplaydisplayFileName.txt',
                duration: 10,
                type: 'Image',
                subtype: 'Somesubtype',
                fsize: 10,
                ctype: 'music',
                fNotes: 'This file is awesome',
                software: 'notepad++',
                network: 'whatNetWork',
                location: 'QmYeUctEPcGN8cdCixTE2eCMBRnue6CgCc6Brvu4rN1Lix',
                sugPlay: 10,
                sugBuy: 10,
                disPlay: true,
                disBuy: true
            }
            const expectedJSON = {
                fname: 'myFileName.txt',
                dname: 'myDisplaydisplayFileName.txt',
                duration: 10,
                type: 'Image',
                subtype: 'Somesubtype',
                fsize: 10,
                ctype: 'music',
                fnotes: 'This file is awesome',
                software: 'notepad++',
                network: 'whatNetWork',
                location: 'QmYeUctEPcGN8cdCixTE2eCMBRnue6CgCc6Brvu4rN1Lix',
                sugPlay: 10,
                sugBuy: 10,
                disPlay: true,
                disBuy: true
            }
            newFileObj.fromJSON(inputJSON)
            expect(newFileObj.toJSON()).eql(expectedJSON)
        })
    })
})
