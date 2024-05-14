import React, { useState } from 'react';
import {
	ScrollView,
	Text,
	View
} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { TestSuite, Tester, Filter } from '@rnoh/testerino';
import { TestCase } from '../../components';

const FILE_PATH = ReactNativeBlobUtil.fs.dirs.DocumentDir;

export function fetchBlobForm() {
	const [errMsg, setErrMsg] = useState('')
	return (
		<Tester style={{ flex: 1 }}>
			<ScrollView style={{ flex: 1 }}>
				<TestSuite name="fetchBlobForm">
					<TestCase.logical
						itShould="write stream to new files."
						fn={async ({ expect }) => {
							let str = ''
							let resData = {}
							try {
								resData = await ReactNativeBlobUtil.fetch(
									'POST',
									'http;//139.9.199.99:3000/tcp/uploadMul',
									{ 'content-type': 'multipart/form-data' },
									[
										{
											name: 'file',
											filename: 'another_1.jpg',
											type: 'image/jpeg',
											data: '/another.jpg'
										},
										{
											name: 'file',
											filename: 'another_2.jpg',
											type: 'image/jpeg',
											data: '/another.jpg'
										}
									]
								)
							} catch (err) {
								str = err.message
								setErrMsg(str)
							}
							expect(resData.respInfo.status).to.equals(200)
						}}
					/>
					<View>
            {errMsg ? <Text style={{ color: '#f00' }}>errMsg:{errMsg}</Text> : ''}
          </View>
				</TestSuite>
			</ScrollView>
		</Tester>
	)
}

export function fetchBlobDown() {
	const [errMsg, setErrMsg] = useState('')
	return (
		<Tester style={{ flex: 1 }}>
			<ScrollView style={{ flex: 1 }}>
				<TestSuite name="fetchBlobDown">
					<TestCase.logical
						itShould="download stream to new file."
						fn={async ({ expect }) => {
							let str = ''
							let resData = {}
							try {
								resData = await ReactNativeBlobUtil.config({
									fileCache: true,
									appendExt: 'jpg',
									path: '/another.jpg',
									session: 'another_jpg'
								}).fetch('GET', 'http://139.9.199.99:3000/tcp/download/blue.jpg')
							} catch (err) {
								str = err.message
								setErrMsg(str)
							}
							expect(resData.data).to.be.equals(FILE_PATH + '/another.jpg')
						}}
					/>
					<View>
            {errMsg ? <Text style={{ color: '#f00' }}>errMsg:{errMsg}</Text> : ''}
          </View>
				</TestSuite>
			</ScrollView>
		</Tester>
	)
}

export function fetchBlobUpload() {
	const [errMsg, setErrMsg] = useState('')
	return (
		<Tester style={{ flex: 1 }}>
			<ScrollView style={{ flex: 1 }}>
				<TestSuite name="fetchBlobUpload">
					<TestCase.logical
						itShould="upload stream to new file."
						fn={async ({ expect }) => {
							let str = ''
							let resData = {}
							try {
								resData = await ReactNativeBlobUtil.fetch(
									'POST',
									'http://139.9.199.99:3000/tcp/uploadBlob',
									{
										'content-type': 'application/octet-stream',
										'Dropbox-API-Arg': JSON.stringify({
											path: '/another_upload.jpg',
											mode: 'add',
											autorename: true,
											mute: false
										})
									},
									ReactNativeBlobUtil.wrap('/another.jpg')
								)
							} catch (err) {
								str = err.message
								setErrMsg(str)
							}
							expect(resData.respInfo.status).to.equals(200)
						}}
					/>
					<View>
            {errMsg ? <Text style={{ color: '#f00' }}>errMsg:{errMsg}</Text> : ''}
          </View>
				</TestSuite>
			</ScrollView>
		</Tester>
	)
}

export function cancelRequest() {
	const [errMsg, setErrMsg] = useState('')
	const [progress, setProgress] = useState(0)
	return (
		<Tester style={{ flex: 1 }}>
			<ScrollView style={{ flex: 1 }}>
				<TestSuite name="cancelRequest">
					<TestCase.logical
						itShould="upload stream to new file."
						fn={async ({ expect }) => {
							let str = ''
							try {
								let a = ReactNativeBlobUtil.config({
									fileCache: true,
									path: 'cancel_request.jpg'
								}).fetch('GET', 'http://139.9.199.99:3000/upload/mypic1.jpg')
								.progress((received, total) => {
									setProgress(Math.floor(Number(received) / Number(total) * 100))
								})
								a.catch(() => {})
								setTimeout(() => {
									a.cancel((err) => {
										expect(err.length).to.be.equals(0)
									})
								}, 1000)
							} catch (err) {
								str = err.message
								setErrMsg(str)
							}
						}}
					/>
					<View>
            {errMsg ? <Text style={{ color: '#f00' }}>errMsg:{errMsg}</Text> : ''}
          </View>
					<Text style={{ color: '#fff' }}>enableProgress:{progress}</Text>
				</TestSuite>
			</ScrollView>
		</Tester>
	)
}

export function enableProgressReport() {
	const [progress, setProgress] = useState(0)
	return (
		<Tester style={{ flex: 1 }}>
			<ScrollView style={{ flex: 1 }}>
				<TestSuite name="enableProgressReport">
					<TestCase.logical
						itShould="download file progress."
						fn={async ({ expect }) => {
							await ReactNativeBlobUtil.config({
								fileCache: true,
								appendExt: 'jpg',
								path: '/another_down_progess.jpg',
								session: 'another_jpg'
							})
								.fetch('GET', 'http://139.9.199.99:3000/upload/mypic1.jpg')
								.progress((received, total) => {
									setProgress(Math.floor(Number(received) / Number(total) * 100))
								})
						}}
					/>
					<Text style={{ color: '#fff' }}>enableProgress:{progress}</Text>
				</TestSuite>
			</ScrollView>
		</Tester>
	)
}

export function enableUploadProgressReport() {
	const [progress, setProgress] = useState(0)
	return (
		<Tester style={{ flex: 1 }}>
			<ScrollView style={{ flex: 1 }}>
				<TestSuite name="enableUploadProgressReport">
					<TestCase.logical
						itShould="upload file progress."
						fn={async ({ expect }) => {
							let res = await ReactNativeBlobUtil.fetch(
								'POST',
								'http://139.9.199.99:3000/tcp/uploadBlob',
								{
									'content-type': 'application/octet-stream',
									'Dropbox-API-Arg': JSON.stringify({
										path: '/another_upload_progess.jpg',
										mode: 'add',
										autorename: true,
										mute: false
									})
								},
								ReactNativeBlobUtil.wrap('/another_down_progess.jpg')
							)
								.progress((written, total) => {
									setProgress(Math.floor(Number(written) / Number(total) * 100))
								})
						}}
					/>
					<Text style={{ color: '#fff' }}>enableUploadProgress:{progress}</Text>
				</TestSuite>
			</ScrollView>
		</Tester>
	)
}

